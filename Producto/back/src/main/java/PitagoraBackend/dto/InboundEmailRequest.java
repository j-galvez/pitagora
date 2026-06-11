package PitagoraBackend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InboundEmailRequest {
    @JsonProperty("from")
    private String fromEmail;

    @JsonProperty("to")
    private String toEmail;

    @JsonProperty("subject")
    private String subject;

    @JsonProperty("body")
    private String body;

    @JsonProperty("html_body")
    private String htmlBody;

    @JsonProperty("message_id")
    private String messageId;

    @JsonProperty("timestamp")
    private Long timestamp;

    // Para validación de webhook
    @JsonProperty("signature")
    private String signature;

    public String getBodyContent() {
        return body != null && !body.isEmpty() ? body : htmlBody;
    }
}
