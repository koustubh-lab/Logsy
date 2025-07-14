package com.spring.blog_application.controller;

import com.spring.blog_application.service.MailService;
import com.spring.blog_application.utils.AuthRequest;
import com.spring.blog_application.utils.AuthResponse;
import com.spring.blog_application.utils.SendOTPRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
public class LoginController {
    private final NimbusJwtEncoder nimbusJwtEncoder;
    private final AuthenticationManager authenticationManager;
    private final MailService mailService;

    public LoginController(NimbusJwtEncoder nimbusJwtEncoder, AuthenticationManager authenticationManager, MailService mailService) {
        this.nimbusJwtEncoder = nimbusJwtEncoder;
        this.authenticationManager = authenticationManager;
        this.mailService = mailService;
    }

    @PostMapping("/api/login/with-email")
    public void sendEmailToUserEmail(@RequestBody SendOTPRequest request) {
        Random random = new Random();
        int OTP = random.nextInt(100000, 999999);
        mailService.sendEmail(request.email(), "Account Activation", "Your OTP is: " + OTP);
    }

    @PostMapping("/api/login")
    public AuthResponse authenticate(@Valid @RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        return new AuthResponse(createToken(authentication));
    }

    private String createToken(Authentication authentication) {
        var claims = JwtClaimsSet.builder()
                .issuer("self")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(60 * 60 * 60))
                .subject(authentication.getName())
                .claim("scope", createScope(authentication))
                .build();

        return nimbusJwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    private String createScope(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));
    }
}
