package com.stayelite.repository;

import com.stayelite.entity.ListingPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListingPhotoRepository extends JpaRepository<ListingPhoto, Long> {
    List<ListingPhoto> findByListingIdOrderByDisplayOrderAsc(Long listingId);
}
