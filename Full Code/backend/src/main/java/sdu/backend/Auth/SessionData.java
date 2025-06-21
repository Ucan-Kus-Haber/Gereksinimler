package sdu.backend.Auth;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionData {
    private String userId;
    private String email;
    private String name;
    private Set<String> roles;
    private String ipAddress;
    private String userAgent;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime loginTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastActivity;

    private String deviceInfo;
    private String location;

    // Login sırasında oluşturmak için constructor
    public SessionData(String userId, String email, String name, Set<String> roles,
                       String ipAddress, String userAgent, String deviceInfo) {
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.roles = roles;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.deviceInfo = deviceInfo;
        this.loginTime = LocalDateTime.now();
        this.lastActivity = LocalDateTime.now();
    }

    // Son aktiviteyi güncelle
    public void updateLastActivity() {
        this.lastActivity = LocalDateTime.now();
    }
}