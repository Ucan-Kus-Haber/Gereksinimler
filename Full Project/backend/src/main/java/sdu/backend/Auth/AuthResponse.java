package sdu.backend.Auth;

import java.util.Set;

class AuthResponse {
    private String token;
    private String userId;
    private String name;
    private String email;
    private String access;
    private Set<String> roles;
    private String redirectUrl;

    public AuthResponse(String token, String userId, String name, String email, String access, Set<String> roles, String redirectUrl) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.access = access;
        this.roles = roles;
        this.redirectUrl = redirectUrl;
    }

    // Getters
    public String getToken() { return token; }
    public String getUserId() { return userId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getAccess() { return access; }
    public Set<String> getRoles() { return roles; }
    public String getRedirectUrl() { return redirectUrl; }
}