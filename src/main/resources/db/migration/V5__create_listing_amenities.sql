CREATE TABLE listing_amenities (
    listing_id UUID NOT NULL,
    amenity_id BIGINT NOT NULL,

    PRIMARY KEY (listing_id, amenity_id),

    CONSTRAINT fk_listing_amenities_listing
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE,

    CONSTRAINT fk_listing_amenities_amenity
        FOREIGN KEY (amenity_id) REFERENCES amenities (id) ON DELETE CASCADE
);

CREATE INDEX idx_listing_amenities_amenity_id ON listing_amenities (amenity_id);
