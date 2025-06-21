// SessionService.java
package sdu.backend.Auth;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Duration;
import java.util.Optional;

@Service
public class SessionService {

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String SESSION_PREFIX = "session:user_id:";
    private static final String BLACKLIST_PREFIX = "blacklist:token:";
    private static final Duration SESSION_DURATION = Duration.ofHours(24);
    private static final Duration BLACKLIST_DURATION = Duration.ofHours(24);

    public SessionService(RedisTemplate<String, String> redisTemplate, ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    // Session bilgilerini kaydet
    public void createSession(String userId, SessionData sessionData) {
        try {
            String key = SESSION_PREFIX + userId;
            String jsonData = objectMapper.writeValueAsString(sessionData);
            redisTemplate.opsForValue().set(key, jsonData, SESSION_DURATION);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create session", e);
        }
    }

    // Session bilgilerini getir
    public Optional<SessionData> getSession(String userId) {
        try {
            String key = SESSION_PREFIX + userId;
            String jsonData = redisTemplate.opsForValue().get(key);

            if (jsonData != null) {
                SessionData sessionData = objectMapper.readValue(jsonData, SessionData.class);
                return Optional.of(sessionData);
            }
            return Optional.empty();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get session", e);
        }
    }

    // Session'ı güncelle
    public void updateSession(String userId, SessionData sessionData) {
        createSession(userId, sessionData); // Aynı key'e yazarak güncelle
    }

    // Session'ı sil
    public void deleteSession(String userId) {
        String key = SESSION_PREFIX + userId;
        redisTemplate.delete(key);
    }

    // Token'ı blacklist'e ekle
    public void blacklistToken(String token) {
        String key = BLACKLIST_PREFIX + token;
        redisTemplate.opsForValue().set(key, "blacklisted", BLACKLIST_DURATION);
    }

    // Token blacklist'te mi kontrol et
    public boolean isTokenBlacklisted(String token) {
        String key = BLACKLIST_PREFIX + token;
        return redisTemplate.hasKey(key);
    }

    // Session süresini uzat
    public void extendSession(String userId) {
        String key = SESSION_PREFIX + userId;
        redisTemplate.expire(key, SESSION_DURATION);
    }
}