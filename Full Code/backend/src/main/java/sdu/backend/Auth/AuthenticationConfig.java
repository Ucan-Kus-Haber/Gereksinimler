package sdu.backend.Auth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import sdu.backend.Auth.Jwt.JwtAuthenticationFilter;
import sdu.backend.Auth.Jwt.JwtUtil;
import sdu.backend.Auth.SessionService;

@Configuration
public class AuthenticationConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserService userService(UserRepository userRepository, PasswordEncoder passwordEncoder, MongoTemplate mongoTemplate) {
        return new UserService(userRepository, passwordEncoder, mongoTemplate);
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(JwtUtil jwtUtil, UserService userService, SessionService sessionService) {
        return new JwtAuthenticationFilter(jwtUtil, userService, sessionService);
    }
}