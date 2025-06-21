package sdu.backend.Auth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import sdu.backend.Auth.Jwt.JwtAuthenticationFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enable @PreAuthorize annotations
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                // Apply CORS configuration defined in the corsConfigurationSource bean
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // IMPORTANT: Allow preflight OPTIONS requests globally BEFORE security checks
                        .requestMatchers("/**").permitAll()

                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/dashboard").permitAll() // Assuming this is public
                        .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/setup-admin").permitAll() // Allow initial admin setup
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()

                        // --- Authenticated Endpoints ---
                        .requestMatchers(HttpMethod.GET,"/profilePage").authenticated()
                        .requestMatchers("/users/**").authenticated()
                        .requestMatchers("/auth/{id}").authenticated() // Consider specific methods if needed
                        .requestMatchers(HttpMethod.PUT, "/auth/{id}").authenticated()

                        // --- Admin Endpoints ---
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/auth/register-admin").hasRole("ADMIN")

                        // --- Secure everything else ---
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }

    @Bean // Make sure this bean is created
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // CORRECTED: Remove leading space and trailing slash
        config.setAllowedOrigins(List.of("http://localhost:5173",
                "https://frontend2.azatvepakulyyev.workers.dev","http://localhost:5174" ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*")); // Allows all standard and custom headers
        config.setAllowCredentials(true); // Important for sending cookies or Authorization headers

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // Apply this config to all paths
        return source;
    }
}