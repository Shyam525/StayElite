package com.stayelite.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import com.stayelite.dto.CreatePaymentIntentRequest;
import com.stayelite.dto.PaymentIntentResponse;
import com.stayelite.entity.Booking;
import com.stayelite.entity.User;
import com.stayelite.repository.BookingRepository;
import com.stayelite.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private static final String CURRENCY = "usd";

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final BookingService bookingService;

    @Value("${stripe.secret-key:}")
    private String secretKey;

    @Value("${stripe.webhook-secret:}")
    private String webhookSecret;

    @PostConstruct
    void configureStripe() {
        if (secretKey != null && !secretKey.isBlank()) Stripe.apiKey = secretKey;
    }

    @Transactional
    public PaymentIntentResponse createPaymentIntent(CreatePaymentIntentRequest request, String email) throws StripeException {
        User guest = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Booking booking = null;
        BigDecimal amount;
        UUID bookingId = request.getBookingId();

        if (bookingId != null) {
            booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
            if (!booking.getGuest().getId().equals(guest.getId())) {
                throw new AccessDeniedException("You can only pay for your own booking");
            }
            if (booking.getStripePaymentIntentId() != null && !booking.getStripePaymentIntentId().isBlank()) {
                PaymentIntent existing = PaymentIntent.retrieve(booking.getStripePaymentIntentId());
                return toResponse(existing);
            }
            amount = booking.getTotalAmount();
        } else {
            if (request.getListingId() == null || request.getCheckIn() == null || request.getCheckOut() == null || request.getGuests() == null) {
                throw new IllegalArgumentException("Provide bookingId or listingId, dates, and guests");
            }
            amount = bookingService.preview(request.getListingId(), request.getCheckIn(), request.getCheckOut(), request.getGuests()).getTotal();
        }

        if (secretKey == null || secretKey.isBlank()) throw new IllegalStateException("Stripe secret key is not configured");
        PaymentIntentCreateParams.Builder params = PaymentIntentCreateParams.builder()
                .setAmount(toMinorUnits(amount))
                .setCurrency(CURRENCY)
                .setAutomaticPaymentMethods(PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build());
        if (booking != null) {
            params.putMetadata("bookingId", booking.getId().toString());
            params.putMetadata("guestId", booking.getGuest().getId().toString());
        }
        PaymentIntent intent = PaymentIntent.create(params.build());
        if (booking != null) {
            booking.setStripePaymentIntentId(intent.getId());
            booking.setPaymentStatus("REQUIRES_PAYMENT");
            bookingRepository.save(booking);
        }
        return toResponse(intent);
    }

    @Transactional
    public void handleWebhook(String payload, String signature) throws StripeException {
        if (webhookSecret == null || webhookSecret.isBlank()) throw new IllegalStateException("Stripe webhook secret is not configured");
        Event event = Webhook.constructEvent(payload, signature, webhookSecret);
        if (!"payment_intent.succeeded".equals(event.getType()) && !"payment_intent.payment_failed".equals(event.getType())) return;

        EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();
        PaymentIntent intent = (PaymentIntent) deserializer.getObject().orElseThrow(() -> new IllegalArgumentException("Unable to deserialize Stripe event"));
        String bookingId = intent.getMetadata().get("bookingId");
        if (bookingId == null) return;
        Booking booking = bookingRepository.findById(UUID.fromString(bookingId))
                .orElseThrow(() -> new IllegalArgumentException("Booking not found for payment intent"));
        if (!intent.getId().equals(booking.getStripePaymentIntentId())) {
            throw new IllegalArgumentException("Payment intent does not match booking");
        }
        if ("payment_intent.succeeded".equals(event.getType())) {
            if (intent.getAmount() == null || intent.getAmount() != toMinorUnits(booking.getTotalAmount()) || !CURRENCY.equalsIgnoreCase(intent.getCurrency())) {
                throw new IllegalArgumentException("Payment amount or currency does not match booking");
            }
            bookingService.confirmAfterPayment(booking.getId(), intent.getId());
        } else if (!"PAID".equals(booking.getPaymentStatus())) {
            booking.setPaymentStatus("PAYMENT_FAILED");
            bookingRepository.save(booking);
        }
    }

    private long toMinorUnits(BigDecimal amount) {
        return amount.movePointRight(2).longValueExact();
    }

    private PaymentIntentResponse toResponse(PaymentIntent intent) {
        return PaymentIntentResponse.builder().clientSecret(intent.getClientSecret()).paymentIntentId(intent.getId()).currency(intent.getCurrency()).build();
    }
}
