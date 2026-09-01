package com.stayelite.controller;

import com.stripe.exception.StripeException;
import com.stayelite.common.ApiResponse;
import com.stayelite.dto.CreatePaymentIntentRequest;
import com.stayelite.dto.PaymentIntentResponse;
import com.stayelite.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/create-intent")
    @PreAuthorize("hasRole('GUEST')")
    public ResponseEntity<ApiResponse<PaymentIntentResponse>> createIntent(
            @Valid @RequestBody CreatePaymentIntentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) throws StripeException {
        return ResponseEntity.ok(ApiResponse.success("Payment intent created",
                paymentService.createPaymentIntent(request, userDetails.getUsername())));
    }

    @PostMapping("/webhook")
    public ResponseEntity<ApiResponse<Void>> webhook(
            @RequestBody String payload,
            @RequestHeader(name = "Stripe-Signature", required = false) String signature) {
        if (signature == null || signature.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Missing Stripe signature"));
        }
        try {
            paymentService.handleWebhook(payload, signature);
            return ResponseEntity.ok(ApiResponse.success("Webhook received", null));
        } catch (StripeException | IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.error("Invalid Stripe webhook"));
        }
    }
}
