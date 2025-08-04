package com.spring.blog_application.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
public class SupabaseService {
    @Value("${supabase.url}")
    private String SUPABASE_URL;

    @Value("${supabase.api.key}")
    private String SUPABASE_API_KEY;

    @Value("${supabase.bucket.name}")
    private String BUCKET_NAME;

    public String uploadImageToSupabase(MultipartFile file, String fileName) throws IOException, InterruptedException {
        String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8.toString());
        String url = SUPABASE_URL + "/storage/v1/object/" + BUCKET_NAME + "/" + encodedFileName;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("apikey", SUPABASE_API_KEY)
                .header("Authorization", "Bearer " + SUPABASE_API_KEY)
                .header("Content-Type", file.getContentType())
                .PUT(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200 || response.statusCode() == 201) {
            return SUPABASE_URL + "/storage/v1/object/public/" + BUCKET_NAME + "/" + fileName;
        } else {
            throw new RuntimeException("Upload failed: " + response.body());
        }
    }
}



