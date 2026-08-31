CREATE TABLE availability (
    id BIGSERIAL PRIMARY KEY,
    listing_id UUID NOT NULL,
    date DATE NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    price_override DECIMAL(12, 2),

    CONSTRAINT fk_availability_listing
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE CASCADE,

    CONSTRAINT uq_availability_listing_date UNIQUE (listing_id, date)
);

CREATE INDEX idx_availability_listing_id ON availability (listing_id);
CREATE INDEX idx_availability_date ON availability (date);
