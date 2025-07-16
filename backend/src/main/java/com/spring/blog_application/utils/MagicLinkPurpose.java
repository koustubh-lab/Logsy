package com.spring.blog_application.utils;

import lombok.Getter;

@Getter
public enum MagicLinkPurpose {
    LOGIN("login"),
    ACTIVATION("activation");

    private final String value;

    MagicLinkPurpose(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }

}
