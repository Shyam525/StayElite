CREATE TABLE amenities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon_name VARCHAR(100) NOT NULL
);

CREATE INDEX idx_amenities_name ON amenities (name);
