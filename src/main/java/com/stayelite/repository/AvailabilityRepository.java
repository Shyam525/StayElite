package com.stayelite.repository;

import com.stayelite.entity.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByListingId(UUID listingId);
    List<Availability> findByListingIdAndDateBetween(UUID listingId, LocalDate startDate, LocalDate endDate);
}
