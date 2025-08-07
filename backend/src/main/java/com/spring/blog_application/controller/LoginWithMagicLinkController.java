package com.spring.blog_application.controller;

import com.spring.blog_application.model.JwtToken;
import com.spring.blog_application.model.User;
import com.spring.blog_application.service.JwtTokenService;
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
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api")
public class LoginWithMagicLinkController {
    private final NimbusJwtEncoder nimbusJwtEncoder;
    private final MailService mailService;
    private final TokenService tokenService;
    private final UserService userService;
    private final JwtTokenService jwtTokenService;

    @Value("${frontend.base.url}")
    private String FRONTEND_URL;

    public LoginWithMagicLinkController(NimbusJwtEncoder nimbusJwtEncoder, MailService mailService, TokenService tokenService, UserService userService, JwtTokenService jwtTokenService) {
        this.nimbusJwtEncoder = nimbusJwtEncoder;
        this.mailService = mailService;
        this.tokenService = tokenService;
        this.userService = userService;
        this.jwtTokenService = jwtTokenService;
    }

    @RateLimit(capacity = 3, refillTokens = 3, refillDuration = 60)
    @PostMapping("/request-email-login")
    public ResponseEntity<String> sendLoginMagicLink(@RequestBody EmailRequest request) {
        try {
            if (userService.doesUserNotExist(request.email())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with email: " + request.email() + " was not found");
            }

            if (!userService.isUserAccountActivated(request.email())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User's account is not activated");
            }

            String token = createToken(request.email(), MagicLinkPurpose.LOGIN.getValue(), 15);

            User user = userService.findByEmail(request.email());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with email: " + request.email() + " was not found");
            }
            JwtToken jwtToken = JwtToken.builder()
                    .token(token)
                    .user(user)
                    .build();
            jwtTokenService.saveToken(jwtToken);

            String authenticationUrl = FRONTEND_URL + "/validate-login-token?token=" + token;
            mailService.sendEmail(
                    request.email(),
                    "Your Secure Login Link",
                    """
                    <p>Hello,</p>
                    <p>You requested to log in to your Logsy account. Click the link below to securely access your account:</p>
                    <p><a href="%s">Click Here to Login</a></p>
                    <p>If you did not request this, you can safely ignore this email.</p>
                    <p>Thanks,<br>The Logsy Team</p>
                    """.formatted(authenticationUrl)
            );

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong: " + e.getMessage());
        }
    }

    @RateLimit(capacity = 2, refillTokens = 2, refillDuration = 60)
    @PostMapping("/request-account-registration")
    public ResponseEntity<String> sendAccountActivationMagicLink(@RequestBody RegisterRequest request) {
        try {
            if (userService.doesUserExist(request.email())) {
                return ResponseEntity.badRequest().body("The email is already associated with an account");
            }

            // * User created with 'disabled' status
            userService.registerUser(request);

            String token = createToken(request.email(), MagicLinkPurpose.ACTIVATION.getValue(), 15);

            User user = userService.findByEmail(request.email());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with email: " + request.email() + " was not found");
            }
            JwtToken jwtToken = JwtToken.builder()
                    .token(token)
                    .user(user)
                    .build();
            jwtTokenService.saveToken(jwtToken);

            String authenticationUrl = FRONTEND_URL + "/activate-account?token=" + token;
            mailService.sendEmail(
                    request.email(),
                    "Identity Verification",
                    """
                    <p>Hello,</p>
                    <p>Thank you for signing up with Logsy! To verify your identity and activate your account, please click the link below:</p>
                    <p><a href="%s">Click Here to Verify your Identity</a></p>
                    <p>This link will expire shortly, so please complete your verification as soon as possible.</p>
                    <p>If you did not initiate this request, you can safely ignore this email.</p>
                    <p>Thanks,<br>The Logsy Team</p>
                    """.formatted(authenticationUrl)
            );
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error, Try again later");
        }
    }

    @PostMapping("/validate-login-magic-link")
    public ResponseEntity<Object> validateLoginMagicLink(@RequestBody TokenRequest tokenRequest) {
        try {
            if (jwtTokenService.isTokenUsed(tokenRequest.token())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is already used");
            }

            String userEmail = tokenService.validateToken(tokenRequest.token(), MagicLinkPurpose.LOGIN.getValue());
            if (userEmail == null || userEmail.isBlank()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Link is invalid or expired.");
            }

            if (userService.doesUserNotExist(userEmail)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with email: " + userEmail + " was not found");
            }
            jwtTokenService.markTokenAsUsed(tokenRequest.token());

            String newToken = createToken(userEmail, MagicLinkPurpose.LOGIN.getValue(), 24 * 60);
            return ResponseEntity.ok(new TokenRequest(newToken));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error, Try again later");
        }
    }

    @PostMapping("/validate-activation-magic-link")
    public ResponseEntity<String> validateActivationMagicLink(@RequestBody TokenRequest tokenRequest) {
        try {
            if (jwtTokenService.isTokenUsed(tokenRequest.token())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Link is invalid or expired.");
            }

            String userEmail = tokenService.validateToken(tokenRequest.token(), MagicLinkPurpose.ACTIVATION.getValue());
            if (userEmail.isBlank()) {
                return ResponseEntity.status(401).body("Link is invalid or expired");
            }
            jwtTokenService.markTokenAsUsed(tokenRequest.token());

            userService.activateUserAccount(userEmail);
            return ResponseEntity.ok().body("Account Activated");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Something went wrong: " + e.getMessage());
        }
    }

    @GetMapping("/wake-up")
    public ResponseEntity<String> wakeUp() {
        return ResponseEntity.ok().build();
    }

    private String createToken(String email, String purpose, int minutes) {
        var claims = JwtClaimsSet.builder()
                .id(UUID.randomUUID().toString())
                .issuer("self")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(60L * minutes))
                .subject(email)
                .claim("scope", UserRoles.USER.toString())
                .claim("purpose", purpose)
                .build();

        return nimbusJwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }
    @GetMapping("/validate-login-token")
    private ResponseEntity<Void> validateJwtToken() {
        return ResponseEntity.ok().build();
    }
}
