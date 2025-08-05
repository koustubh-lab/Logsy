package com.spring.blog_application.utils;

import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class KeyLoader {

    private static final String PRIVATE_KEY_PATH = "/etc/secrets/private.pem";
    private static final String PUBLIC_KEY_PATH = "/etc/secrets/public.pem";

    public static PrivateKey loadPrivateKey() throws Exception {
        String key = readKey(PRIVATE_KEY_PATH);
        key = key.replaceAll("-----\\w+ PRIVATE KEY-----", "").replaceAll("\\s", "");
        byte[] decoded = Base64.getDecoder().decode(key);
        return KeyFactory.getInstance("RSA").generatePrivate(new PKCS8EncodedKeySpec(decoded));
    }

    public static PublicKey loadPublicKey() throws Exception {
        String key = readKey(PUBLIC_KEY_PATH);
        key = key.replaceAll("-----\\w+ PUBLIC KEY-----", "").replaceAll("\\s", "");
        byte[] decoded = Base64.getDecoder().decode(key);
        return KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(decoded));
    }

    private static String readKey(String absolutePath) throws Exception {
        return Files.readString(Path.of(absolutePath));
    }
}


/*
// * Old Code for loading keys
package com.spring.blog_application.utils;

import java.io.InputStream;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class KeyLoader {

    public static PrivateKey loadPrivateKey() throws Exception {
        String key = readKey("keys/private.pem");
        key = key.replaceAll("-----\\w+ PRIVATE KEY-----", "").replaceAll("\\s", "");
        byte[] decoded = Base64.getDecoder().decode(key);
        return KeyFactory.getInstance("RSA").generatePrivate(new PKCS8EncodedKeySpec(decoded));
    }

    public static PublicKey loadPublicKey() throws Exception {
        String key = readKey("keys/public.pem");
        key = key.replaceAll("-----\\w+ PUBLIC KEY-----", "").replaceAll("\\s", "");
        byte[] decoded = Base64.getDecoder().decode(key);
        return KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(decoded));
    }

    private static String readKey(String path) throws Exception {
        InputStream is = KeyLoader.class.getClassLoader().getResourceAsStream(path);
        return new String(is.readAllBytes());
    }
}

*/
