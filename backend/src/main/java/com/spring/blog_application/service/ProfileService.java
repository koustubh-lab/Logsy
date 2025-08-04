package com.spring.blog_application.service;

import com.spring.blog_application.dto.ProfileDTO;
import com.spring.blog_application.model.Profile;
import com.spring.blog_application.model.User;
import com.spring.blog_application.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@Slf4j
@Service
public class ProfileService {
    private final UserRepository userRepository;
    private final SupabaseService supabaseService;

    public ProfileService(UserRepository userRepository, SupabaseService supabaseService) {
        this.userRepository = userRepository;
        this.supabaseService = supabaseService;
    }

    public ProfileDTO getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email);
        Profile profile = user.getProfile();

        return new ProfileDTO(
                profile.getId(),
                profile.getUsername(),
                profile.getEmail(),
                profile.getProfessions(),
                profile.getBio(),
                profile.getLocation(),
                profile.getProfilePicture(),
                profile.getGithubLink(),
                profile.getLinkedinLink(),
                profile.getTwitterLink(),
                user.getCreatedAt()
        );
    }

    public void setProfileImage(MultipartFile profileImage, String email) {
        try {
            User user = userRepository.findByEmail(email);
            if (user == null) {
                throw new EntityNotFoundException("User with email: " + email + " was not found");
            }

            Profile profile = user.getProfile();
            if (profile == null) {
                throw new EntityNotFoundException("Profile of user with email: " + email + " was not found");
            }

            String publicUrl = supabaseService.uploadImageToSupabase(profileImage, profileImage.getOriginalFilename());
            if (publicUrl == null || publicUrl.isEmpty()) {
                throw new IllegalStateException("Failed to upload image to Supabase");
            }

            profile.setProfilePicture(publicUrl);
            userRepository.save(user);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    public void updateProfileDetails(ProfileDTO profileDTO, String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new EntityNotFoundException("User with email: " + email + " was not found");
        }

        Profile profile = user.getProfile();
        if (profile == null) {
            throw new EntityNotFoundException("Profile of user with email: " + email + " was not found");
        }

        profile.setGithubLink(profileDTO.github());
        profile.setLinkedinLink(profileDTO.linkedin());
        profile.setTwitterLink(profileDTO.twitter());
        profile.setLocation(profileDTO.location());

        userRepository.save(user);
    }

    public void updatePersonalDetails(ProfileDTO profileDTO, String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new EntityNotFoundException("User with email: " + email + " was not found");
        }

        Profile profile = user.getProfile();
        if (profile == null) {
            throw new EntityNotFoundException("Profile of user with email: " + email + " was not found");
        }

        user.setUsername(profileDTO.username());
        profile.setUsername(profileDTO.username());
        profile.setProfessions(profileDTO.professions());
        profile.setBio(profileDTO.bio());

        userRepository.save(user);
    }

    public void updateAccountDetails(ProfileDTO profileDTO, String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new EntityNotFoundException("User with email: " + email + " was not found");
        }

        Profile profile = user.getProfile();
        if (profile == null) {
            throw new EntityNotFoundException("Profile of user with email: " + email + " was not found");
        }

        profile.setEmail(profileDTO.email());
        userRepository.save(user);
    }

    public void deleteAccount(String userEmail) {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new EntityNotFoundException("User with email: " + userEmail + " was not found");
        }
        userRepository.delete(user);
    }
}
