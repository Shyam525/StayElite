package com.stayelite.service;

import com.stayelite.dto.*;
import com.stayelite.entity.*;
import com.stayelite.mapper.ListingMapper;
import com.stayelite.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;
    private final UserRepository userRepository;
    private final AmenityRepository amenityRepository;
    private final ListingAmenityRepository listingAmenityRepository;
    private final ListingPhotoRepository listingPhotoRepository;
    private final AvailabilityRepository availabilityRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final ListingMapper listingMapper;

    @Transactional
    public ListingResponse createListing(CreateListingRequest request, String email) {
        User host = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (host.getRole() != UserRole.HOST) {
            throw new AccessDeniedException("Only hosts can create listings");
        }

        Listing listing = listingMapper.toEntity(request);
        listing.setHost(host);
        listing.setIsActive(true);
        LocalDateTime now = LocalDateTime.now();
        listing.setCreatedAt(now);
        listing.setUpdatedAt(now);

        Listing savedListing = listingRepository.save(listing);
        saveAmenityLinks(savedListing, request.getAmenityIds());
        return buildListingResponse(savedListing);
    }

    @Transactional
    public ListingResponse updateListing(UUID listingId, CreateListingRequest request, String email) {
        Listing listing = getOwnedListing(listingId, email);
        listingMapper.updateEntityFromRequest(request, listing);
        listing.setUpdatedAt(LocalDateTime.now());
        Listing savedListing = listingRepository.save(listing);
        saveAmenityLinks(savedListing, request.getAmenityIds());
        return buildListingResponse(savedListing);
    }

    @Transactional
    public void deleteListing(UUID listingId, String email) {
        Listing listing = getOwnedListing(listingId, email);
        listingRepository.delete(listing);
    }

    public ListingResponse getListingById(UUID listingId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found"));
        return buildListingResponse(listing);
    }

    public List<ListingResponse> getMyListings(String email) {
        User host = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return listingRepository.findByHost_Id(host.getId()).stream()
                .map(this::buildListingResponse)
                .collect(Collectors.toList());
    }

    public ListingSearchResponse searchListings(
            String city,
            LocalDate checkIn,
            LocalDate checkOut,
            Integer guests,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String propertyType,
            List<Long> amenities,
            int page,
            int size) {

        if (size <= 0) size = 20;
        if (page < 0) page = 0;

        Pageable pageable = PageRequest.of(page, size);
        Specification<Listing> spec = buildSearchSpecification(city, guests, minPrice, maxPrice, propertyType, amenities);

        Page<Listing> result = listingRepository.findAll(spec, pageable);

        if (checkIn != null && checkOut != null) {
            List<UUID> excludedIds = findBookingsExcludingDates(checkIn, checkOut);
            if (!excludedIds.isEmpty()) {
                result = new org.springframework.data.domain.PageImpl<>(
                        result.getContent().stream()
                                .filter(listing -> !excludedIds.contains(listing.getId()))
                                .collect(Collectors.toList()),
                        pageable,
                        result.getTotalElements()
                );
            }
        }

        List<ListingResponse> content = result.getContent().stream()
                .map(this::buildListingResponse)
                .collect(Collectors.toList());

        return ListingSearchResponse.builder()
                .content(content)
                .page(page)
                .size(size)
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
    }

    @Transactional
    public List<String> uploadPhotos(UUID listingId, List<MultipartFile> files, String email) {
        Listing listing = getOwnedListing(listingId, email);

        String uploadDir = "uploads/listings/" + listingId;
        Path targetDir = Paths.get(uploadDir);
        try {
            Files.createDirectories(targetDir);
        } catch (IOException e) {
            throw new IllegalStateException("Could not create upload directory", e);
        }

        List<String> urls = new ArrayList<>();
        int order = 0;

        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) continue;
            String originalName = Objects.requireNonNull(file.getOriginalFilename());
            String fileName = UUID.randomUUID() + "_" + originalName;
            Path targetPath = targetDir.resolve(fileName);

            try {
                file.transferTo(targetPath);
            } catch (IOException e) {
                throw new IllegalStateException("Failed to save photo " + originalName, e);
            }

            String url = "/uploads/listings/" + listingId + "/" + fileName;
            ListingPhoto photo = ListingPhoto.builder()
                    .listing(listing)
                    .url(url)
                    .displayOrder(order++)
                    .build();
            listingPhotoRepository.save(photo);
            urls.add(url);
        }

        return urls;
    }

    @Transactional
    public List<Availability> setAvailability(UUID listingId, List<AvailabilityRequest> requests, String email) {
        Listing listing = getOwnedListing(listingId, email);
        List<Availability> saved = new ArrayList<>();

        for (AvailabilityRequest request : requests) {
            Availability availability = availabilityRepository.findByListing_IdAndDate(listingId, request.getDate())
                    .orElseGet(() -> Availability.builder().listing(listing).date(request.getDate()).build());

            availability.setIsAvailable(request.getIsAvailable());
            availability.setPriceOverride(request.getPriceOverride());
            saved.add(availabilityRepository.save(availability));
        }

        return saved;
    }

    private Listing getOwnedListing(UUID listingId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found"));

        if (!listing.getHost().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not own this listing");
        }

        return listing;
    }

    private Specification<Listing> buildSearchSpecification(
            String city,
            Integer guests,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String propertyType,
            List<Long> amenities) {

        Specification<Listing> spec = Specification.where(null);

        if (city != null && !city.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(cb.lower(root.get("city")), city.trim().toLowerCase()));
        }

        if (guests != null && guests > 0) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("maxGuests"), guests));
        }

        if (minPrice != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("basePricePerNight"), minPrice));
        }

        if (maxPrice != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("basePricePerNight"), maxPrice));
        }

        if (propertyType != null && !propertyType.isBlank()) {
            try {
                PropertyType enumType = PropertyType.valueOf(propertyType.toUpperCase(Locale.ROOT));
                spec = spec.and((root, query, cb) -> cb.equal(root.get("propertyType"), enumType));
            } catch (IllegalArgumentException ignored) {
                // ignore invalid filter values
            }
        }

        if (amenities != null && !amenities.isEmpty()) {
            spec = spec.and((root, query, cb) -> {
                var amenityJoin = root.join("listingAmenities", jakarta.persistence.criteria.JoinType.INNER);
                return amenityJoin.get("amenity").get("id").in(amenities);
            });
        }

        return spec;
    }

    private List<UUID> findBookingsExcludingDates(LocalDate checkIn, LocalDate checkOut) {
        List<Booking> bookings = bookingRepository.findAll().stream()
                .filter(booking -> booking.getStatus() == BookingStatus.CONFIRMED)
                .filter(booking -> booking.getCheckIn().isBefore(checkOut) && booking.getCheckOut().isAfter(checkIn))
                .collect(Collectors.toList());

        return bookings.stream().map(booking -> booking.getListing().getId()).distinct().toList();
    }

    private void saveAmenityLinks(Listing listing, List<Long> amenityIds) {
        if (amenityIds == null) {
            return;
        }

        listingAmenityRepository.deleteByListing_Id(listing.getId());

        for (Long amenityId : amenityIds) {
            Amenity amenity = amenityRepository.findById(amenityId)
                    .orElseThrow(() -> new IllegalArgumentException("Amenity not found: " + amenityId));

            listingAmenityRepository.save(ListingAmenity.builder()
                    .listing(listing)
                    .amenity(amenity)
                    .build());
        }
    }

    private ListingResponse buildListingResponse(Listing listing) {
        ListingResponse response = listingMapper.toResponse(listing);

        List<ListingPhoto> photos = listingPhotoRepository.findByListing_IdOrderByDisplayOrderAsc(listing.getId());
        response.setPhotoUrls(photos.stream().map(ListingPhoto::getUrl).collect(Collectors.toList()));

        List<ListingAmenity> links = listingAmenityRepository.findByListing_Id(listing.getId());
        response.setAmenityIds(links.stream().map(link -> link.getAmenity().getId()).collect(Collectors.toList()));

        List<Review> reviews = reviewRepository.findByListing_Id(listing.getId());
        double avgRating = reviews.stream()
                .mapToInt(Review::getOverallRating)
                .average()
                .orElse(0.0);
        response.setAverageRating(Math.round(avgRating * 10.0) / 10.0);

        return response;
    }
}
