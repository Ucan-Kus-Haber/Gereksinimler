package sdu.backend.Auth;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import sdu.backend.Auth.Jwt.JwtUtil;
import sdu.backend.Auth.user.User;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173",
        "https://frontend2.azatvepakulyyev.workers.dev","http://localhost:5174"})
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final SessionService sessionService;

    public AuthController(UserService userService, JwtUtil jwtUtil,
                          PasswordEncoder passwordEncoder, SessionService sessionService) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.sessionService = sessionService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        logger.info("Login attempt for email: {}", loginRequest.getEmail());
        Optional<User> userOpt = userService.findByEmail(loginRequest.getEmail());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                String token = jwtUtil.generateToken(user.getEmail());

                // Session bilgilerini oluştur ve Redis'e kaydet
                SessionData sessionData = new SessionData(
                        user.getId(),
                        user.getEmail(),
                        user.getName(),
                        user.getRoles(),
                        getClientIpAddress(request),
                        request.getHeader("User-Agent"),
                        extractDeviceInfo(request.getHeader("User-Agent"))
                );

                sessionService.createSession(user.getId(), sessionData);

                String role = user.getRoles().contains("ADMIN") ? "admin" : "user";
                String redirectUrl = "/dashboard";

                logger.info("Login successful for email: {} with role: {}", loginRequest.getEmail(), role);
                AuthResponse response = new AuthResponse(token, user.getId(),
                        user.getName(), user.getEmail(), role, user.getRoles(), redirectUrl);
                return ResponseEntity.ok(response);
            } else {
                logger.warn("Invalid password for email: {}", loginRequest.getEmail());
            }
        } else {
            logger.warn("User not found for email: {}", loginRequest.getEmail());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.getEmailFromToken(token);

            if (email != null) {
                Optional<User> userOpt = userService.findByEmail(email);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();

                    // Token'ı blacklist'e ekle
                    sessionService.blacklistToken(token);

                    // Session'ı sil
                    sessionService.deleteSession(user.getId());

                    logger.info("User logged out successfully: {}", email);
                    return ResponseEntity.ok().body("Logged out successfully");
                }
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        } catch (Exception e) {
            logger.error("Error during logout: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Logout failed");
        }
    }

    @GetMapping("/session")
    public ResponseEntity<?> getCurrentSession(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.getEmailFromToken(token);

            if (email != null) {
                Optional<User> userOpt = userService.findByEmail(email);
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    Optional<SessionData> sessionData = sessionService.getSession(user.getId());

                    if (sessionData.isPresent()) {
                        // Son aktiviteyi güncelle
                        SessionData session = sessionData.get();
                        session.updateLastActivity();
                        sessionService.updateSession(user.getId(), session);

                        return ResponseEntity.ok(session);
                    } else {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Session not found");
                    }
                }
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        } catch (Exception e) {
            logger.error("Error getting session: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to get session");
        }
    }

    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.getEmailFromToken(token);

            Optional<User> user = userService.findByEmail(email);

            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            logger.error("Error getting current user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody User userDetails, @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.getEmailFromToken(token);

            Optional<User> existingUser = userService.findByEmail(email);

            if (existingUser.isPresent()) {
                User user = existingUser.get();
                // Update user fields except for email and password
                if (userDetails.getName() != null) user.setName(userDetails.getName());
                if (userDetails.getSurname() != null) user.setSurname(userDetails.getSurname());
                if (userDetails.getDateOfBirth() != null) user.setDateOfBirth(userDetails.getDateOfBirth());
                if (userDetails.getPhoneNumber() != null) user.setPhoneNumber(userDetails.getPhoneNumber());
                if (userDetails.getAddress() != null) user.setAddress(userDetails.getAddress());
                if (userDetails.getNationality() != null) user.setNationality(userDetails.getNationality());
                if (userDetails.getGender() != null) user.setGender(userDetails.getGender());
                if (userDetails.getProfilePicture() != null) user.setProfilePicture(userDetails.getProfilePicture());
                if (userDetails.getBio() != null) user.setBio(userDetails.getBio());

                User updatedUser = userService.save(user);
                return ResponseEntity.ok(updatedUser);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            logger.error("Error updating profile: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update profile: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAll();
        if (users.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        Optional<User> user = userService.findById(id);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        logger.info("Register request received: email={}, name={}", user.getEmail(), user.getName());
        try {
            user.getRoles().add("USER");
            User savedUser = userService.registerUser(user);
            String token = jwtUtil.generateToken(savedUser.getEmail());
            AuthResponse response = new AuthResponse(token, savedUser.getId(),
                    savedUser.getName(), savedUser.getEmail(), "user", savedUser.getRoles(), "/dashboard");
            logger.info("User registered successfully: {}", savedUser.getEmail());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Registration failed: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register-admin")
    @PreAuthorize("hasRole('ADMIN')")  // Only existing admins can create new admins
    public ResponseEntity<?> registerAdmin(@RequestBody User user) {
        logger.info("Admin register request: email={}", user.getEmail());

        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.getRoles().add("ADMIN"); // Add admin role
            User savedUser = userService.save(user);

            String token = jwtUtil.generateToken(savedUser.getEmail());
            AuthResponse response = new AuthResponse(token, savedUser.getId(),
                    savedUser.getName(), savedUser.getEmail(), "admin", savedUser.getRoles(), "/dashboard");

            logger.info("Admin registered successfully: {}", savedUser.getEmail());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Admin registration failed: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/setup-admin")
    public ResponseEntity<?> setupFirstAdmin(@RequestBody User user) {
        logger.info("First admin setup request: email={}", user.getEmail());

        // Check if any admin exists already
        if (userService.adminExists()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Admin already exists. Use register-admin endpoint.");
        }

        try {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.getRoles().add("ADMIN");
            User savedUser = userService.save(user);

            String token = jwtUtil.generateToken(savedUser.getEmail());
            AuthResponse response = new AuthResponse(token, savedUser.getId(),
                    savedUser.getName(), savedUser.getEmail(), "admin", savedUser.getRoles(), "/dashboard");

            logger.info("First admin set up successfully: {}", savedUser.getEmail());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("First admin setup failed: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Kullanıcının IP adresini al
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedForHeader = request.getHeader("X-Forwarded-For");
        if (xForwardedForHeader == null) {
            return request.getRemoteAddr();
        } else {
            return xForwardedForHeader.split(",")[0];
        }
    }

    // User-Agent'tan basit device bilgisi çıkar
    private String extractDeviceInfo(String userAgent) {
        if (userAgent == null) return "Unknown";

        if (userAgent.contains("Mobile")) {
            return "Mobile Device";
        } else if (userAgent.contains("Tablet")) {
            return "Tablet";
        } else {
            return "Desktop";
        }
    }
}