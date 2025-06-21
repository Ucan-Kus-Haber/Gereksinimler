package sdu.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import sdu.backend.dto.CommentModerationEvent;
import sdu.backend.dto.CommentNotificationEvent;

@Slf4j
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendNewCommentNotification(CommentNotificationEvent event) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("admin@yoursite.com"); // Configure admin email
            message.setSubject("New Comment on: " + event.getNewsArticleTitle());
            message.setText(String.format(
                    "A new comment has been posted on your article '%s'.\n\n" +
                            "Author: %s\n" +
                            "Comment: %s\n\n" +
                            "View the article: /news/%s",
                    event.getNewsArticleTitle(),
                    event.getAuthorName(),
                    event.getContent(),
                    event.getNewsArticleId()
            ));

            mailSender.send(message);
            log.info("Sent new comment notification email for comment ID: {}", event.getCommentId());
        } catch (Exception e) {
            log.error("Failed to send new comment notification email for comment ID: {}", event.getCommentId(), e);
        }
    }

    public void sendReplyNotification(CommentNotificationEvent event) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(event.getParentCommentAuthorEmail());
            message.setSubject("Someone replied to your comment");
            message.setText(String.format(
                    "Hello,\n\n" +
                            "%s has replied to your comment:\n\n" +
                            "Reply: %s\n\n" +
                            "View the conversation: /news/%s",
                    event.getAuthorName(),
                    event.getContent(),
                    event.getNewsArticleId()
            ));

            mailSender.send(message);
            log.info("Sent reply notification email for comment ID: {}", event.getCommentId());
        } catch (Exception e) {
            log.error("Failed to send reply notification email for comment ID: {}", event.getCommentId(), e);
        }
    }

    public void sendModerationAlert(CommentModerationEvent event) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("moderator@yoursite.com"); // Configure moderator email
            message.setSubject("High-Risk Comment Requires Review");
            message.setText(String.format(
                    "A comment with high spam risk score (%d) requires manual review.\n\n" +
                            "Comment ID: %s\n" +
                            "Author: %s (%s)\n" +
                            "IP Address: %s\n" +
                            "Content: %s\n\n" +
                            "Please review in the admin panel.",
                    event.getRiskScore(),
                    event.getCommentId(),
                    event.getAuthorName(),
                    event.getAuthorEmail(),
                    event.getIpAddress(),
                    event.getContent()
            ));

            mailSender.send(message);
            log.info("Sent moderation alert email for comment ID: {}", event.getCommentId());
        } catch (Exception e) {
            log.error("Failed to send moderation alert email for comment ID: {}", event.getCommentId(), e);
        }
    }
}