package com.stayelite.service;

import com.stayelite.dto.WishlistCollectionRequest;
import com.stayelite.dto.WishlistCollectionResponse;
import com.stayelite.dto.WishlistItemResponse;
import com.stayelite.dto.WishlistToggleResponse;
import com.stayelite.entity.Listing;
import com.stayelite.entity.ListingPhoto;
import com.stayelite.entity.User;
import com.stayelite.entity.Wishlist;
import com.stayelite.entity.WishlistCollection;
import com.stayelite.exception.CollectionNotFoundException;
import com.stayelite.exception.ListingNotFoundException;
import com.stayelite.exception.UnauthorizedCollectionAccessException;
import com.stayelite.repository.ListingPhotoRepository;
import com.stayelite.repository.ListingRepository;
import com.stayelite.repository.UserRepository;
import com.stayelite.repository.WishlistCollectionRepository;
import com.stayelite.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistCollectionRepository collectionRepository;
    private final UserRepository userRepository;
    private final ListingRepository listingRepository;
    private final ListingPhotoRepository listingPhotoRepository;
    private final StringRedisTemplate redisTemplate;

    private static final String WISHLIST_CACHE_PREFIX = "wishlist:";

    @Transactional
    public WishlistToggleResponse toggleWishlist(UUID userId, UUID listingId) {
        User user = findUser(userId);
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new ListingNotFoundException("Listing not found with id: " + listingId));

        Optional<Wishlist> existing = wishlistRepository.findByUserIdAndListingId(userId, listingId);
        boolean saved;
        String message;

        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
            saved = false;
            message = "Removed from wishlist";
        } else {
            Wishlist wishlist = Wishlist.builder()
                    .user(user)
                    .listing(listing)
                    .build();
            wishlistRepository.save(wishlist);
            saved = true;
            message = "Added to wishlist";
        }

        invalidateUserCache(userId);

        return WishlistToggleResponse.builder()
                .saved(saved)
                .message(message)
                .listingId(listingId)
                .build();
    }

    @Transactional(readOnly = true)
    public List<WishlistItemResponse> getUserWishlist(UUID userId) {
        List<Wishlist> wishlists = wishlistRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return wishlists.stream().map(w -> {
            Listing listing = w.getListing();
            String primaryPhoto = listingPhotoRepository
                    .findByListing_IdOrderByDisplayOrderAsc(listing.getId())
                    .stream()
                    .findFirst()
                    .map(ListingPhoto::getUrl)
                    .orElse(null);

            Double averageRating = listing.getAverageRating() != null ? listing.getAverageRating() : 0.0;

            return WishlistItemResponse.builder()
                    .listingId(listing.getId())
                    .title(listing.getTitle())
                    .city(listing.getCity())
                    .country(listing.getCountry())
                    .primaryPhotoUrl(primaryPhoto)
                    .pricePerNight(BigDecimal.valueOf(listing.getBasePricePerNight()))
                    .averageRating(averageRating)
                    .reviewCount(listing.getReviews() != null ? listing.getReviews().size() : 0)
                    .propertyType(listing.getPropertyType())
                    .savedAt(w.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean isListingInWishlist(UUID userId, UUID listingId) {
        return wishlistRepository.existsByUserIdAndListingId(userId, listingId);
    }

    @Transactional(readOnly = true)
    public Map<UUID, Boolean> getWishlistStatus(UUID userId, List<UUID> listingIds) {
        if (listingIds == null || listingIds.isEmpty()) {
            return Collections.emptyMap();
        }

        List<UUID> savedIds = wishlistRepository.findSavedListingIdsByUserIdAndListingIdIn(userId, listingIds);
        Set<UUID> savedSet = new HashSet<>(savedIds);

        Map<UUID, Boolean> statusMap = new HashMap<>();
        for (UUID listingId : listingIds) {
            statusMap.put(listingId, savedSet.contains(listingId));
        }

        // Cache in Redis asynchronously
        try {
            String cacheKey = WISHLIST_CACHE_PREFIX + userId;
            String savedCommaSeparated = savedSet.stream().map(UUID::toString).collect(Collectors.joining(","));
            redisTemplate.opsForValue().set(cacheKey, savedCommaSeparated, Duration.ofMinutes(10));
        } catch (Exception e) {
            log.warn("Failed to update Redis wishlist cache for user {}", userId);
        }

        return statusMap;
    }

    @Transactional
    public WishlistCollectionResponse createCollection(UUID userId, WishlistCollectionRequest request) {
        User user = findUser(userId);

        WishlistCollection collection = WishlistCollection.builder()
                .user(user)
                .name(request.getName().trim())
                .listings(new ArrayList<>())
                .build();

        WishlistCollection saved = collectionRepository.save(collection);

        return toCollectionResponse(saved);
    }

    @Transactional
    public void addToCollection(UUID userId, UUID collectionId, UUID listingId) {
        WishlistCollection collection = findCollectionForUser(userId, collectionId);
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new ListingNotFoundException("Listing not found with id: " + listingId));

        if (!collection.getListings().contains(listing)) {
            collection.getListings().add(listing);
            collectionRepository.save(collection);
        }
    }

    @Transactional
    public void removeFromCollection(UUID userId, UUID collectionId, UUID listingId) {
        WishlistCollection collection = findCollectionForUser(userId, collectionId);
        collection.getListings().removeIf(l -> l.getId().equals(listingId));
        collectionRepository.save(collection);
    }

    @Transactional(readOnly = true)
    public List<WishlistCollectionResponse> getUserCollections(UUID userId) {
        List<WishlistCollection> collections = collectionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return collections.stream().map(this::toCollectionResponse).collect(Collectors.toList());
    }

    @Transactional
    public void deleteCollection(UUID userId, UUID collectionId) {
        WishlistCollection collection = findCollectionForUser(userId, collectionId);
        collectionRepository.delete(collection);
    }

    private WishlistCollectionResponse toCollectionResponse(WishlistCollection collection) {
        List<String> previewPhotos = collection.getListings().stream()
                .map(l -> listingPhotoRepository.findByListing_IdOrderByDisplayOrderAsc(l.getId()).stream().findFirst().map(ListingPhoto::getUrl).orElse(null))
                .filter(Objects::nonNull)
                .limit(3)
                .collect(Collectors.toList());

        return WishlistCollectionResponse.builder()
                .id(collection.getId())
                .name(collection.getName())
                .listingCount(collection.getListings().size())
                .previewPhotoUrls(previewPhotos)
                .createdAt(collection.getCreatedAt())
                .build();
    }

    private WishlistCollection findCollectionForUser(UUID userId, UUID collectionId) {
        WishlistCollection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new CollectionNotFoundException("Collection not found with id: " + collectionId));

        if (!collection.getUser().getId().equals(userId)) {
            throw new UnauthorizedCollectionAccessException("Collection does not belong to current user");
        }
        return collection;
    }

    private User findUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
    }

    private void invalidateUserCache(UUID userId) {
        try {
            redisTemplate.delete(WISHLIST_CACHE_PREFIX + userId);
        } catch (Exception e) {
            log.warn("Redis delete failed for wishlist key {}", userId);
        }
    }
}
