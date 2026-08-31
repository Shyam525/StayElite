package com.stayelite.service;

import com.stayelite.dto.AuthResponse;
import com.stayelite.dto.LoginRequest;
import com.stayelite.dto.RegisterRequest;
import com.stayelite.dto.UserDto;
import com.stayelite.entity.User;
import com.stayelite.entity.UserRole;
import com.stayelite.repository.UserRepository;
import com.stayelite.security.UserDetailsServiceImpl;
import com.stayelite.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;
    private final StringRedisTemplate redisTemplate;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("User already exists with this email");
        }

        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .phone(request.getPhone())
                .role(UserRole.GUEST)
                .emailVerified(false)
                .build();

        User savedUser = userRepository.save(user);
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());

        return buildAuthResponse(userDetails, savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenticationException("Invalid email or password") {
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AuthenticationException("Invalid email or password") {
            };
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        return buildAuthResponse(userDetails, user);
    }

    public AuthResponse refresh(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new IllegalArgumentException("Refresh token is required");
        }

        String token = normalizeBearer(refreshToken);

        if (!jwtUtil.validateToken(token)) {
            throw new AuthenticationException("Invalid refresh token") {
            };
        }

        String tokenType = jwtUtil.extractClaims(token).get("token_type", String.class);
        if (!"refresh".equals(tokenType)) {
            throw new AuthenticationException("Invalid refresh token type") {
            };
        }

        if (isTokenBlacklisted(token)) {
            throw new AuthenticationException("Refresh token has been revoked") {
            };
        }

        String email = jwtUtil.extractUsername(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenticationException("User not found") {
                });

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String newAccessToken = jwtUtil.generateToken(userDetails);
        String newRefreshToken = jwtUtil.generateRefreshToken(userDetails);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .user(UserDto.fromEntity(user))
                .build();
    }

    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new IllegalArgumentException("Refresh token is required");
        }

        String token = normalizeBearer(refreshToken);
        if (!jwtUtil.validateToken(token)) {
            throw new AuthenticationException("Invalid refresh token") {
            };
        }

        String tokenType = jwtUtil.extractClaims(token).get("token_type", String.class);
        if (!"refresh".equals(tokenType)) {
            throw new AuthenticationException("Invalid refresh token type") {
            };
        }

        long ttlMs = jwtUtil.extractClaims(token).getExpiration().getTime() - System.currentTimeMillis();
        if (ttlMs > 0) {
            redisTemplate.opsForValue().set("blacklist:refresh:" + token, "revoked", ttlMs, TimeUnit.MILLISECONDS);
        }
    }

    private boolean isTokenBlacklisted(String token) {
        return Boolean.TRUE.equals(redisTemplate.hasKey("blacklist:refresh:" + token));
    }

    private String normalizeBearer(String authHeader) {
        if (authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return authHeader;
    }

    private AuthResponse buildAuthResponse(UserDetails userDetails, User user) {
        String accessToken = jwtUtil.generateToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(UserDto.fromEntity(user))
                .build();
    }
}
