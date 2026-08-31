CREATE TABLE wishlists (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    listing_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_wishlists_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,

    CONSTRAINT fk_wishlists_listing
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE,

    CONSTRAINT uq_wishlist_user_listing UNIQUE (user_id, listing_id)
);

CREATE INDEX idx_wishlists_user_id ON wishlists (user_id);
CREATE INDEX idx_wishlists_listing_id ON wishlists (listing_id);
