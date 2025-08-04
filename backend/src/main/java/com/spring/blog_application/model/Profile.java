package com.spring.blog_application.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "profiles")
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String username;
    private String email;

    @ElementCollection
    @CollectionTable(
            name = "profile_professions", // * name of the new table
            joinColumns = @JoinColumn(name = "profile_id") // * FK to the parent table (Profile)
    )
    @Column(name = "profession")
    private List<String> professions;

    @Column(name = "bio", columnDefinition = "TEXT")
    private String bio;
    private String location;

    @Column(name = "profile_picture")
    private String profilePicture;

    private String githubLink;
    private String twitterLink;
    private String linkedinLink;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
}