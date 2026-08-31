package com.stayelite.repository;

import com.stayelite.entity.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ListingRepository extends JpaRepository<Listing, UUID> {
    List<Listing> findByHost_Id(UUID hostId);
    List<Listing> findByCity(String city);
}
