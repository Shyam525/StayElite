CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL,
    guest_id UUID NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests_count INTEGER NOT NULL DEFAULT 1,
    base_amount DECIMAL(12, 2) NOT NULL,
    cleaning_fee DECIMAL(12, 2) NOT NULL DEFAULT 0,
    service_fee DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,
    status booking_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bookings_listing
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE RESTRICT,

    CONSTRAINT fk_bookings_guest
        FOREIGN KEY (guest_id) REFERENCES users (id) ON DELETE RESTRICT,

    CONSTRAINT chk_check_in_before_check_out CHECK (check_in < check_out)
);

CREATE INDEX idx_bookings_listing_id ON bookings (listing_id);
CREATE INDEX idx_bookings_guest_id ON bookings (guest_id);
CREATE INDEX idx_bookings_status ON bookings (status);
