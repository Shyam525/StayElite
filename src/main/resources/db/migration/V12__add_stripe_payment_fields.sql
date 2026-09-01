ALTER TABLE bookings
    ADD COLUMN stripe_payment_intent_id VARCHAR(255),
    ADD COLUMN payment_status VARCHAR(30) NOT NULL DEFAULT 'UNPAID';

CREATE UNIQUE INDEX uq_bookings_stripe_payment_intent_id
    ON bookings (stripe_payment_intent_id)
    WHERE stripe_payment_intent_id IS NOT NULL;
