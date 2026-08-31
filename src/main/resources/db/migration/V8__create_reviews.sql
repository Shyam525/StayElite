CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    booking_id UUID NOT NULL,
    reviewer_id UUID NOT NULL,
    listing_id UUID NOT NULL,
    overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    cleanliness_rating INTEGER NOT NULL CHECK (cleanliness_rating BETWEEN 1 AND 5),
    location_rating INTEGER NOT NULL CHECK (location_rating BETWEEN 1 AND 5),
    value_rating INTEGER NOT NULL CHECK (value_rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reviews_booking
        FOREIGN KEY (booking_id) REFERENCES bookings (id) ON DELETE CASCADE,

    CONSTRAINT fk_reviews_reviewer
        FOREIGN KEY (reviewer_id) REFERENCES users (id) ON DELETE CASCADE,

    CONSTRAINT fk_reviews_listing
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE,

    CONSTRAINT uq_review_booking UNIQUE (booking_id)
);

CREATE INDEX idx_reviews_listing_id ON reviews (listing_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews (reviewer_id);
