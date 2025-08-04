package com.spring.blog_application.controller;

import com.spring.blog_application.dto.ProfileDTO;
import com.spring.blog_application.model.Profile;
import com.spring.blog_application.model.User;
import com.spring.blog_application.service.ProfileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api")
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileDTO> getProfile(Authentication authentication) {
        return ResponseEntity.ok(profileService.getProfileByEmail(authentication.getName()));
    }

    @PostMapping("/upload-profile-picture")
    public ResponseEntity<Void> setProfilePicture(@RequestParam("image") MultipartFile imageFile, Authentication authentication) {
        profileService.setProfileImage(imageFile, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/update-profile-details")
    public ResponseEntity<Void> updateProfileDetails(@RequestBody ProfileDTO profileDTO, Authentication authentication) {
        log.info("Update method executed: {}", profileDTO);
        profileService.updateProfileDetails(profileDTO, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/update-personal-details")
    public ResponseEntity<Void> updatePersonalDetails(@RequestBody ProfileDTO profileDTO, Authentication authentication) {
        profileService.updatePersonalDetails(profileDTO, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/update-account-details")
    public ResponseEntity<Void> updateAccountDetails(@RequestBody ProfileDTO profileDTO, Authentication authentication) {
        profileService.updateAccountDetails(profileDTO, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<Void> deleteAccount(Authentication authentication) {
        profileService.deleteAccount(authentication.getName());
        return ResponseEntity.ok().build();
    }
}
