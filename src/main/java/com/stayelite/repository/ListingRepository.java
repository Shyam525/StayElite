package com.stayelite.repository;

import com.stayelite.entity.Listing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ListingRepository extends JpaRepository<Listing, UUID>, JpaSpecificationExecutor<Listing> {
    List<Listing> findByHost_Id(UUID hostId);
    Page<Listing> findByHost_Id(UUID hostId, Pageable pageable);
    List<Listing> findByCity(String city);
}
