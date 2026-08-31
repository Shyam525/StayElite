package com.stayelite.repository;

import com.stayelite.entity.ListingAmenity;
import com.stayelite.entity.ListingAmenityId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ListingAmenityRepository extends JpaRepository<ListingAmenity, ListingAmenityId> {
    List<ListingAmenity> findByListingId(UUID listingId);
    void deleteByListingId(UUID listingId);
}
