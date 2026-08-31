CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    listing_id UUID,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_messages_sender
        FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,

    CONSTRAINT fk_messages_receiver
        FOREIGN KEY (receiver_id) REFERENCES users (id) ON DELETE CASCADE,

    CONSTRAINT fk_messages_listing
        FOREIGN KEY (listing_id) REFERENCES listings (id) ON DELETE SET NULL
);

CREATE INDEX idx_messages_sender_id ON messages (sender_id);
CREATE INDEX idx_messages_receiver_id ON messages (receiver_id);
CREATE INDEX idx_messages_listing_id ON messages (listing_id);
