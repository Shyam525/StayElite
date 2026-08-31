package com.stayelite.repository;

import com.stayelite.entity.ListingPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ListingPhotoRepository extends JpaRepository<ListingPhoto, Long> {
    List<ListingPhoto> findByListing_IdOrderByDisplayOrderAsc(UUID listingId);
}
