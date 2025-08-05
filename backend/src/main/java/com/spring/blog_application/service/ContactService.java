package com.spring.blog_application.service;

import com.spring.blog_application.dto.ContactDTO;
import org.springframework.stereotype.Service;

@Service
public class ContactService {
    private final MailService mailService;

    public ContactService(MailService mailService) {
        this.mailService = mailService;
    }

    public void contactAdmin(ContactDTO contactDTO) {
        String htmlContent = buildHtmlContent(contactDTO);
        mailService.sendEmail("logsy.app@gmail.com", contactDTO.subject(), htmlContent);
    }

    private String buildHtmlContent(ContactDTO contactDTO) {
        return """
    <html>
    <head>
        <style>
            .email-container {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f4f6f8;
                padding: 30px;
                color: #333;
            }
            .content-box {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                max-width: 600px;
                margin: auto;
            }
            h2 {
                color: #1a1a1a;
                margin-bottom: 20px;
            }
            .label {
                font-weight: 600;
                color: #555;
                margin-top: 15px;
                margin-bottom: 5px;
            }
            .value {
                background-color: #f1f3f5;
                padding: 12px 15px;
                border-radius: 8px;
                color: #222;
                white-space: pre-line;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="content-box">
                <h2>📩 New Contact Form Submission</h2>
                <div>
                    <div class="label">👤 Name</div>
                    <div class="value">%s</div>

                    <div class="label">📧 Email</div>
                    <div class="value">%s</div>

                    <div class="label">📝 Subject</div>
                    <div class="value">%s</div>

                    <div class="label">💬 Message</div>
                    <div class="value">%s</div>
                </div>
            </div>
        </div>
    </body>
    </html>
    """.formatted(
                escapeHtml(contactDTO.name()),
                escapeHtml(contactDTO.email()),
                escapeHtml(contactDTO.subject()),
                escapeHtml(contactDTO.message())
        );
    }


    private String escapeHtml(String input) {
        return input
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#x27;");
    }
}
