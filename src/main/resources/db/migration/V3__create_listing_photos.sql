CREATE TABLE listing_photos (
    id BIGSERIAL PRIMARY KEY,
    listing_id UUID NOT NULL,
    url VARCHAR(500) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT fk_listing_photos_listing
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE
);

CREATE INDEX idx_listing_photos_listing_id ON listing_photos (listing_id);
