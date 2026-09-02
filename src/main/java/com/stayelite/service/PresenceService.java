package com.stayelite.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class PresenceService {

    private final StringRedisTemplate redisTemplate;
    private static final String PRESENCE_KEY_PREFIX = "user:presence:";
    
    // In-memory fallback map if Redis connection is not present
    private final Map<String, Long> memoryPresenceMap = new ConcurrentHashMap<>();

    public void setUserOnline(String userIdOrEmail) {
        if (userIdOrEmail == null) return;
        long now = System.currentTimeMillis();
        memoryPresenceMap.put(userIdOrEmail, now);

        try {
            redisTemplate.opsForValue().set(PRESENCE_KEY_PREFIX + userIdOrEmail, String.valueOf(now), Duration.ofDays(7));
            log.info("User {} marked ONLINE in Redis", userIdOrEmail);
        } catch (Exception e) {
            log.warn("Redis unavailable, using in-memory presence for user {}", userIdOrEmail);
        }
    }

    public void setUserOffline(String userIdOrEmail) {
        if (userIdOrEmail == null) return;
        long now = System.currentTimeMillis();
        memoryPresenceMap.put(userIdOrEmail, now);

        try {
            redisTemplate.opsForValue().set(PRESENCE_KEY_PREFIX + userIdOrEmail, String.valueOf(now), Duration.ofDays(7));
            log.info("User {} marked OFFLINE in Redis at {}", userIdOrEmail, now);
        } catch (Exception e) {
            log.warn("Redis unavailable, using in-memory presence for user {}", userIdOrEmail);
        }
    }

    public Map<String, Object> getUserPresence(String userIdOrEmail) {
        Map<String, Object> result = new HashMap<>();
        if (userIdOrEmail == null) {
            result.put("isOnline", false);
            result.put("lastSeen", null);
            return result;
        }

        Long timestamp = null;
        try {
            String stored = redisTemplate.opsForValue().get(PRESENCE_KEY_PREFIX + userIdOrEmail);
            if (stored != null) {
                timestamp = Long.parseLong(stored);
            }
        } catch (Exception e) {
            log.warn("Redis read failed for presence key {}", userIdOrEmail);
        }

        if (timestamp == null) {
            timestamp = memoryPresenceMap.get(userIdOrEmail);
        }

        if (timestamp == null) {
            result.put("isOnline", false);
            result.put("lastSeen", "Offline");
            return result;
        }

        long diffMs = System.currentTimeMillis() - timestamp;
        boolean isOnline = diffMs < 60000; // Connected within last 60s

        result.put("isOnline", isOnline);
        result.put("timestamp", timestamp);

        if (isOnline) {
            result.put("lastSeen", "Online");
        } else {
            long mins = diffMs / (1000 * 60);
            if (mins < 60) {
                result.put("lastSeen", "Last seen " + mins + "m ago");
            } else {
                long hours = mins / 60;
                result.put("lastSeen", "Last seen " + hours + "h ago");
            }
        }

        return result;
    }
}
