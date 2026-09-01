package com.stayelite.repository;

import com.stayelite.entity.Booking;
import com.stayelite.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
import java.time.LocalDate;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByGuest_Id(UUID guestId);
    List<Booking> findByListing_Id(UUID listingId);
    List<Booking> findByListing_IdAndStatus(UUID listingId, BookingStatus status);

    List<Booking> findByGuest_IdAndStatus(UUID guestId, BookingStatus status);

    List<Booking> findByListing_IdAndStatusAndCheckInLessThanAndCheckOutGreaterThan(
            UUID listingId,
            BookingStatus status,
            LocalDate checkOut,
            LocalDate checkIn);
}
