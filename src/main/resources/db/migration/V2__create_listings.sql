CREATE TYPE property_type AS ENUM (
    'APARTMENT',
    'HOUSE',
    'VILLA',
    'CABIN',
    'LOFT',
    'COTTAGE',
    'MANSION',
    'BUNGALOW',
    'TOWNHOUSE',
    'CONDOMINIUM'
);

CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type property_type NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    base_price_per_night DECIMAL(12, 2) NOT NULL,
    cleaning_fee DECIMAL(12, 2) NOT NULL DEFAULT 0,
    max_guests INTEGER NOT NULL DEFAULT 1,
    bedrooms INTEGER NOT NULL DEFAULT 0,
    bathrooms INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_listings_host
        FOREIGN KEY (host_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_listings_host_id ON listings (host_id);
CREATE INDEX idx_listings_city ON listings (city);
CREATE INDEX idx_listings_country ON listings (country);
