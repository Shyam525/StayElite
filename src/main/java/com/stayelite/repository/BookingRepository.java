package com.stayelite.repository;

import com.stayelite.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByGuest_Id(UUID guestId);
    List<Booking> findByListing_Id(UUID listingId);
}
