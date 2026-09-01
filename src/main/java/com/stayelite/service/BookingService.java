package com.stayelite.service;

import com.stayelite.dto.BookingResponse;
import com.stayelite.dto.CreateBookingRequest;
import com.stayelite.dto.PricingBreakdownResponse;
import com.stayelite.entity.Availability;
import com.stayelite.entity.Booking;
import com.stayelite.entity.BookingStatus;
import com.stayelite.entity.Listing;
import com.stayelite.entity.User;
import com.stayelite.entity.UserRole;
import com.stayelite.repository.AvailabilityRepository;
import com.stayelite.repository.BookingRepository;
import com.stayelite.repository.ListingRepository;
import com.stayelite.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
    private static final BigDecimal SERVICE_FEE_RATE = new BigDecimal("0.12");

    private final BookingRepository bookingRepository;
    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final AvailabilityRepository availabilityRepository;

    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request, String email) {
        User guest = findUser(email);
        requireRole(guest, UserRole.GUEST, "Only guests can create bookings");
        Listing listing = findListing(request.getListingId());
        validateDates(request.getCheckIn(), request.getCheckOut());
        validateGuestCount(request.getGuestsCount(), listing);
        ensureAvailable(listing, request.getCheckIn(), request.getCheckOut());

        PricingBreakdownResponse pricing = calculatePricing(listing, request.getCheckIn(), request.getCheckOut());
        Booking booking = Booking.builder()
                .listing(listing)
                .guest(guest)
                .checkIn(request.getCheckIn())
                .checkOut(request.getCheckOut())
                .guestsCount(request.getGuestsCount())
                .baseAmount(pricing.getBaseAmount())
                .serviceFee(pricing.getServiceFee())
                .cleaningFee(pricing.getCleaningFee())
                .totalAmount(pricing.getTotal())
                .status(BookingStatus.PENDING)
                .build();
        return toResponse(bookingRepository.save(booking));
    }

    @Transactional(readOnly = true)
    public PricingBreakdownResponse preview(UUID listingId, LocalDate checkIn, LocalDate checkOut, Integer guests) {
        Listing listing = findListing(listingId);
        validateDates(checkIn, checkOut);
        validateGuestCount(guests, listing);
        ensureAvailable(listing, checkIn, checkOut);
        return calculatePricing(listing, checkIn, checkOut);
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(UUID bookingId, String email) {
        User user = findUser(email);
        Booking booking = findBooking(bookingId);
        requireBookingAccess(booking, user);
        return toResponse(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(String email, BookingStatus status) {
        User guest = findUser(email);
        List<Booking> bookings = status == null
                ? bookingRepository.findByGuest_Id(guest.getId())
                : bookingRepository.findByGuest_IdAndStatus(guest.getId(), status);
        return bookings.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsForMyListings(String email) {
        User host = findUser(email);
        requireRole(host, UserRole.HOST, "Only hosts can view listing bookings");
        return bookingRepository.findAll().stream()
                .filter(booking -> booking.getListing().getHost().getId().equals(host.getId()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse cancelBooking(UUID bookingId, String email) {
        User user = findUser(email);
        Booking booking = findBooking(bookingId);
        requireBookingAccess(booking, user);
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalArgumentException("Booking is already cancelled");
        }
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new IllegalArgumentException("Completed bookings cannot be cancelled");
        }
        if (!LocalDateTime.now().isBefore(booking.getCheckIn().atStartOfDay().minusHours(24))) {
            throw new IllegalArgumentException("Bookings cannot be cancelled within 24 hours of check-in");
        }

        boolean wasConfirmed = booking.getStatus() == BookingStatus.CONFIRMED;
        booking.setStatus(BookingStatus.CANCELLED);
        if (wasConfirmed) {
            setDatesAvailable(booking);
        }
        return toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public BookingResponse confirmBooking(UUID bookingId, String email) {
        User host = findUser(email);
        requireRole(host, UserRole.HOST, "Only hosts can confirm bookings");
        Booking booking = findBooking(bookingId);
        if (!booking.getListing().getHost().getId().equals(host.getId())) {
            throw new AccessDeniedException("You do not manage this listing");
        }
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Only pending bookings can be confirmed");
        }
        if (!"PAID".equals(booking.getPaymentStatus())) {
            throw new IllegalArgumentException("Booking can only be confirmed after payment succeeds");
        }
        ensureAvailable(booking.getListing(), booking.getCheckIn(), booking.getCheckOut());
        booking.setStatus(BookingStatus.CONFIRMED);
        setDatesUnavailable(booking);
        return toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public void confirmAfterPayment(UUID bookingId, String paymentIntentId) {
        Booking booking = findBooking(bookingId);
        if (booking.getStripePaymentIntentId() != null && !paymentIntentId.equals(booking.getStripePaymentIntentId())) {
            throw new IllegalArgumentException("Payment intent does not match booking");
        }
        if (booking.getStatus() == BookingStatus.CONFIRMED && "PAID".equals(booking.getPaymentStatus())) return;
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Only pending bookings can be paid");
        }
        ensureAvailable(booking.getListing(), booking.getCheckIn(), booking.getCheckOut());
        booking.setStripePaymentIntentId(paymentIntentId);
        booking.setPaymentStatus("PAID");
        booking.setStatus(BookingStatus.CONFIRMED);
        setDatesUnavailable(booking);
        bookingRepository.save(booking);
    }

    private PricingBreakdownResponse calculatePricing(Listing listing, LocalDate checkIn, LocalDate checkOut) {
        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        BigDecimal baseAmount = listing.getBasePricePerNight().multiply(BigDecimal.valueOf(nights));
        BigDecimal serviceFee = baseAmount.multiply(SERVICE_FEE_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal cleaningFee = listing.getCleaningFee() == null ? BigDecimal.ZERO : listing.getCleaningFee();
        return PricingBreakdownResponse.builder()
                .baseAmount(baseAmount)
                .serviceFee(serviceFee)
                .cleaningFee(cleaningFee)
                .total(baseAmount.add(serviceFee).add(cleaningFee))
                .nights(nights)
                .build();
    }

    private void ensureAvailable(Listing listing, LocalDate checkIn, LocalDate checkOut) {
        if (!Boolean.TRUE.equals(listing.getIsActive())) {
            throw new IllegalArgumentException("This listing is not active");
        }
        if (!bookingRepository.findByListing_IdAndStatusAndCheckInLessThanAndCheckOutGreaterThan(
                listing.getId(), BookingStatus.CONFIRMED, checkOut, checkIn).isEmpty()) {
            throw new IllegalArgumentException("The listing is already booked for these dates");
        }
        boolean unavailable = availabilityRepository.findByListing_IdAndDateBetween(
                        listing.getId(), checkIn, checkOut.minusDays(1)).stream()
                .anyMatch(date -> !Boolean.TRUE.equals(date.getIsAvailable()));
        if (unavailable) {
            throw new IllegalArgumentException("The listing is unavailable for these dates");
        }
    }

    private void setDatesUnavailable(Booking booking) {
        updateDates(booking, false);
    }

    private void setDatesAvailable(Booking booking) {
        updateDates(booking, true);
    }

    private void updateDates(Booking booking, boolean available) {
        for (LocalDate date = booking.getCheckIn(); date.isBefore(booking.getCheckOut()); date = date.plusDays(1)) {
            LocalDate bookingDate = date;
            Availability availability = availabilityRepository.findByListing_IdAndDate(booking.getListing().getId(), bookingDate)
                .orElseGet(() -> Availability.builder().listing(booking.getListing()).date(bookingDate).build());
            availability.setIsAvailable(available);
            availabilityRepository.save(availability);
        }
    }

    private void validateDates(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null || !checkIn.isBefore(checkOut)) {
            throw new IllegalArgumentException("Check-in must be before check-out");
        }
        if (!checkIn.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Check-in must be in the future");
        }
    }

    private void validateGuestCount(Integer guests, Listing listing) {
        if (guests == null || guests < 1 || guests > listing.getMaxGuests()) {
            throw new IllegalArgumentException("Guest count must be between 1 and " + listing.getMaxGuests());
        }
    }

    private void requireBookingAccess(Booking booking, User user) {
        boolean guest = booking.getGuest().getId().equals(user.getId());
        boolean host = booking.getListing().getHost().getId().equals(user.getId());
        if (!guest && !host) throw new AccessDeniedException("You cannot access this booking");
    }

    private void requireRole(User user, UserRole role, String message) {
        if (user.getRole() != role) throw new AccessDeniedException(message);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private Listing findListing(UUID id) {
        return listingRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Listing not found"));
    }

    private Booking findBooking(UUID id) {
        return bookingRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Booking not found"));
    }

    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .listingId(booking.getListing().getId())
                .listingTitle(booking.getListing().getTitle())
                .guestId(booking.getGuest().getId())
                .guestName(booking.getGuest().getFullName())
                .hostId(booking.getListing().getHost().getId())
                .hostName(booking.getListing().getHost().getFullName())
                .checkIn(booking.getCheckIn())
                .checkOut(booking.getCheckOut())
                .guestsCount(booking.getGuestsCount())
                .baseAmount(booking.getBaseAmount())
                .serviceFee(booking.getServiceFee())
                .cleaningFee(booking.getCleaningFee())
                .totalAmount(booking.getTotalAmount())
                .status(booking.getStatus())
                .stripePaymentIntentId(booking.getStripePaymentIntentId())
                .paymentStatus(booking.getPaymentStatus())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}
