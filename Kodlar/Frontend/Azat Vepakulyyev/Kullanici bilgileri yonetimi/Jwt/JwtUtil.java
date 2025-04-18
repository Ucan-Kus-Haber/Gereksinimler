package sdu.backend.Auth.Jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import sdu.backend.Auth.user.User;
import sdu.backend.Auth.user.UserRepository;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretString;

    @Value("${jwt.expiration:86400000}")
    private long expiration;

    private final UserRepository userRepository;

    public JwtUtil(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretString.getBytes());
    }

    // Generate token with roles included
    public String generateToken(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        Set<String> roles = new HashSet<>();

        if (userOpt.isPresent()) {
            roles = userOpt.get().getRoles();
        }

        return Jwts.builder()
                .subject(email)
                .claim("roles", roles)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    public String getEmailFromToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return claims.getPayload().getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        try {
            Jws<Claims> claimsJws = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return claimsResolver.apply(claimsJws.getPayload());
        } catch (Exception e) {
            return null;
        }
    }

    public Set<String>  extractRoles(String token) {
        Object rolesObj = extractClaim(token, claims -> claims.get("roles"));

        if (rolesObj instanceof Set<?>) {
            return (Set<String>) rolesObj;
        } else if (rolesObj instanceof List<?>) {
            return new HashSet<>((List<String>) rolesObj);
        } else if (rolesObj instanceof String) {
            return new HashSet<>(Set.of(((String) rolesObj).replace("[", "").replace("]", "").replace("\"", "").split(",")));
        } else {
            return new HashSet<>();
        }
    }
}