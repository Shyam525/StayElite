package com.stayelite.mapper;

import com.stayelite.dto.CreateListingRequest;
import com.stayelite.dto.ListingResponse;
import com.stayelite.entity.Amenity;
import com.stayelite.entity.Listing;
import com.stayelite.entity.ListingPhoto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ListingMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "host", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "latitude", source = "lat")
    @Mapping(target = "longitude", source = "lng")
    Listing toEntity(CreateListingRequest request);

    @Mapping(target = "hostId", source = "host.id")
    @Mapping(target = "hostName", source = "host.fullName")
    @Mapping(target = "averageRating", ignore = true)
    @Mapping(target = "photoUrls", ignore = true)
    @Mapping(target = "amenityIds", ignore = true)
    ListingResponse toResponse(Listing listing);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "host", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "latitude", source = "lat")
    @Mapping(target = "longitude", source = "lng")
    void updateEntityFromRequest(CreateListingRequest request, @MappingTarget Listing listing);

    @Named("mapAmenityIds")
    default List<Long> mapAmenityIds(List<Amenity> amenities) {
        if (amenities == null) return null;
        return amenities.stream().map(Amenity::getId).collect(Collectors.toList());
    }

    @Named("mapPhotoUrls")
    default List<String> mapPhotoUrls(List<ListingPhoto> photoList) {
        if (photoList == null) return null;
        return photoList.stream().map(ListingPhoto::getUrl).collect(Collectors.toList());
    }

    @Named("mapBigDecimal")
    default BigDecimal mapBigDecimal(Double value) {
        return value == null ? null : BigDecimal.valueOf(value);
    }

    @Named("mapDouble")
    default Double mapDouble(BigDecimal value) {
        return value == null ? null : value.doubleValue();
    }

    @Named("mapUuid")
    default UUID mapUuid(java.util.UUID value) {
        return value;
    }
}
