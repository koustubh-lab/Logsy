package com.spring.blog_application.controller;

import com.spring.blog_application.service.MailService;
import com.spring.blog_application.service.TokenService;
import com.spring.blog_application.service.UserService;
import com.spring.blog_application.utils.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@Slf4j
@RestController
public class LoginWithMagicLinkController {
    private final NimbusJwtEncoder nimbusJwtEncoder;
    private final MailService mailService;
    private final TokenService tokenService;
    private final UserService userService;

    @Value("${frontend.base.url}")
    private String FRONTEND_URL;

    public LoginWithMagicLinkController(NimbusJwtEncoder nimbusJwtEncoder, MailService mailService, TokenService tokenService, UserService userService) {
        this.nimbusJwtEncoder = nimbusJwtEncoder;
        this.mailService = mailService;
        this.tokenService = tokenService;
        this.userService = userService;
    }

    @PostMapping("/api/request-email-login")
    public ResponseEntity<String> sendLoginMagicLink(@RequestBody EmailRequest request) {
        try {
            if (userService.doesUserNotExist(request.email())) {
                return ResponseEntity.notFound().build();
            }

            String token = createToken(request.email(), MagicLinkPurpose.LOGIN.getValue(), 15);
            String authenticationUrl = FRONTEND_URL + "/validate-login-token?token=" + token;
            mailService.sendEmail(request.email(),
                    "Logsy: Login Link", "Click the given link to login into your account: \n" + authenticationUrl);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong: " + e.getMessage());
        }
    }

    @PostMapping("/api/request-account-registration")
    public ResponseEntity<String> sendAccountActivationMagicLink(@RequestBody RegisterRequest request) {
        try {
            if (userService.doesUserExist(request.email())) {
                return ResponseEntity.badRequest().body("The email is already associated with an account");
            }

            // * User created with 'disabled' status
            userService.registerUser(request);

            String token = createToken(request.email(), MagicLinkPurpose.ACTIVATION.getValue(), 15);
            String authenticationUrl = FRONTEND_URL + "/activate-account?token=" + token;
            mailService.sendEmail(request.email(),
                    "Logsy: Identity Verification", "Click the given link to activate your account: \n" + authenticationUrl);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong: " + e.getMessage());
        }
    }

    @PostMapping("/api/validate-login-magic-link")
    public ResponseEntity<Object> validateLoginMagicLink(@RequestBody TokenRequest tokenRequest) {
        try {
            String userEmail = tokenService.validateToken(tokenRequest.token(), MagicLinkPurpose.LOGIN.getValue());
            if (userEmail == null || userEmail.isBlank()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Link is invalid or expired.");
            }

            if (userService.doesUserNotExist(userEmail)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with email: " + userEmail + " was not found");
            }

            String newToken = createToken(userEmail, MagicLinkPurpose.LOGIN.getValue(), 24 * 60);
            return ResponseEntity.ok(new TokenRequest(newToken));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong: " + e.getMessage());
        }
    }

    @PostMapping("/api/validate-activation-magic-link")
    public ResponseEntity<String> validateActivationMagicLink(@RequestBody TokenRequest tokenRequest) {
        try {
            String userEmail = tokenService.validateToken(tokenRequest.token(), MagicLinkPurpose.ACTIVATION.getValue());
            if (userEmail.isBlank()) {
                return ResponseEntity.status(401).body("Link is invalid or expired");
            }

            userService.activateUserAccount(userEmail);
            return ResponseEntity.ok().body("Account Activated");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Something went wrong: " + e.getMessage());
        }
    }

    private String createToken(String email, String purpose, int minutes) {
        var claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(60L * minutes))
                .subject(email)
                .claim("scope", UserRoles.USER.toString())
                .claim("purpose", purpose)
                .build();

        return nimbusJwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
}
