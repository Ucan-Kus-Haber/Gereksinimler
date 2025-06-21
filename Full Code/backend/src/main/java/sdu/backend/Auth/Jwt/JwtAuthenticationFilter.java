// JwtAuthenticationFilter.java (güncellenmiş)
package sdu.backend.Auth.Jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import sdu.backend.Auth.UserService;
import sdu.backend.Auth.SessionService;

import java.io.IOException;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final List<String> PUBLIC_ENDPOINTS = List.of(
            "/auth/login",
            "/auth/register",
            "/auth/setup-admin",
            "/faculties",
            "/universities"
    );

    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final SessionService sessionService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserService userService, SessionService sessionService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.sessionService = sessionService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Public endpoint'ler için authentication skip et
        String requestURI = request.getRequestURI();
        if (PUBLIC_ENDPOINTS.stream().anyMatch(requestURI::startsWith)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String authHeader = request.getHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                logger.debug("No JWT token found in request headers");
                filterChain.doFilter(request, response);
                return;
            }

            String jwt = authHeader.substring(7);

            // Token blacklist'te mi kontrol et
            if (sessionService.isTokenBlacklisted(jwt)) {
                logger.debug("Token is blacklisted");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\":\"Token has been invalidated\"}");
                response.setContentType("application/json");
                return;
            }

            String email = jwtUtil.getEmailFromToken(jwt);
            logger.debug("JWT token found, email extracted: " + email);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                try {
                    UserDetails userDetails = userService.loadUserByUsername(email);
                    logger.debug("User details loaded for email: " + email);

                    if (jwtUtil.validateToken(jwt)) {
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );

                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        logger.debug("Authentication set in SecurityContext for user: " + email);
                    } else {
                        logger.debug("Token validation failed for email: " + email);
                    }
                } catch (Exception e) {
                    logger.error("Error loading user by email: " + email, e);
                }
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: " + e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }
}