package com.websoftware_26_1.petcare.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeminiIntroService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiIntroService.class);
    private static final String GEMINI_BASE_URL =
        "https://generativelanguage.googleapis.com/v1beta/models/";

    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    @Value("${gemini.api-key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-2.5-flash}")
    private String model;

    public GeminiIntroService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.restTemplate = new RestTemplate();
    }

    public IntroResult generateIntro(IntroPrompt prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            logger.warn("GEMINI_API_KEY가 없음. Gemini 소개 생성을 건너뜀.");
            return IntroResult.empty();
        }

        IntroResult first = requestIntro(prompt, false);
        if (isValidIntro(first.intro())) {
            return first;
        }

        IntroResult retry = requestIntro(prompt, true);
        if (isValidIntro(retry.intro())) {
            return retry;
        }
        return IntroResult.empty();
    }

    private IntroResult requestIntro(IntroPrompt prompt, boolean strict) {
        ResponsePayload payload = requestIntroWithPrompt(buildPrompt(prompt, strict));
        return payload.result();
    }

    private ResponsePayload requestIntroWithPrompt(String promptText) {
        try {
            Map<String, Object> payload = Map.of(
                "contents", List.of(
                    Map.of(
                        "role", "user",
                        "parts", List.of(Map.of("text", promptText))
                    )
                ),
                "generationConfig", Map.of(
                    "temperature", 0.9,
                    "topP", 0.9,
                    "maxOutputTokens", 200
                )
            );

            String url = GEMINI_BASE_URL + model + ":generateContent?key=" + apiKey;
            String response = restTemplate.postForObject(url, payload, String.class);
            if (response == null || response.isBlank()) {
                return ResponsePayload.empty();
            }
            JsonNode root = objectMapper.readTree(response);
            String intro = extractBestIntro(root);
            Usage usage = parseUsage(root);
            return new ResponsePayload(new IntroResult(intro), usage);
        } catch (Exception ex) {
            logger.warn("Gemini 소개 호출 실패: {}", ex.getMessage());
            return ResponsePayload.empty();
        }
    }

    public DebugResult debugGenerate(IntroPrompt prompt, boolean strict) {
        String promptText = buildPrompt(prompt, strict);
        ResponsePayload payload = requestIntroWithPrompt(promptText);
        return new DebugResult(promptText, payload.result().intro(), payload.usage());
    }

    private boolean isValidIntro(String intro) {
        return intro != null && intro.trim().length() >= 12;
    }

    private String extractBestIntro(JsonNode root) {
        JsonNode candidates = root.path("candidates");
        if (!candidates.isArray() || candidates.isEmpty()) {
            return null;
        }
        String text = candidates.path(0).path("content").path("parts").path(0).path("text").asText(null);
        if (text == null || text.isBlank()) {
            return null;
        }
        return cleanupLine(text.replace("\r", "").trim());
    }

    private String cleanupLine(String line) {
        if (line == null) {
            return null;
        }
        String trimmed = line
            .replaceAll("^[0-9]+[).\\s]+", "")
            .replaceAll("^[\\-•]+\\s*", "")
            .trim();
        return trimmed;
    }

    private Usage parseUsage(JsonNode root) {
        JsonNode usageNode = root.path("usageMetadata");
        if (usageNode.isMissingNode() || usageNode.isNull()) {
            return null;
        }
        int promptTokens = usageNode.path("promptTokenCount").asInt(0);
        int candidateTokens = usageNode.path("candidatesTokenCount").asInt(0);
        int totalTokens = usageNode.path("totalTokenCount").asInt(0);
        if (promptTokens == 0 && candidateTokens == 0 && totalTokens == 0) {
            return null;
        }
        return new Usage(promptTokens, candidateTokens, totalTokens);
    }

    private String buildPrompt(IntroPrompt prompt, boolean strict) {
        StringBuilder builder = new StringBuilder();
        builder.append("너는 유기동물 보호소에 있는 동물이야. ");
        builder.append("아래 정보를 바탕으로 입양 가족에게 1줄 자기소개를 해줘. ");
        builder.append("말투는 귀엽고 개성 있게, 의인화된 느낌. ");
        if (strict) {
            builder.append("15~40자, 1문장으로. ");
            builder.append("단순 인사말만 하지 말고 종이나 성격 정보를 꼭 넣어줘. ");
        } else {
            builder.append("15~40자, 1문장으로. ");
        }
        builder.append("종/성격/특징 중 최소 1개는 꼭 포함해줘. ");
        builder.append("성격 후보: 발랄함, 소심함, 애교많음, 느긋함, 호기심, 의젓함, 장난꾸러기, 수줍음\n");
        builder.append("위 성격 후보 중 1~2개를 랜덤으로 골라 반영해줘.\n");
        builder.append("- 종: ").append(prompt.kind()).append("\n");
        builder.append("- 성별: ").append(prompt.gender()).append("\n");
        builder.append("- 나이: ").append(prompt.age()).append("\n");
        builder.append("- 체중: ").append(prompt.weight()).append("\n");
        builder.append("- 색상: ").append(prompt.color()).append("\n");
        builder.append("- 발견 장소: ").append(prompt.discoveryPlace()).append("\n");
        builder.append("- 특징: ").append(prompt.description()).append("\n");
        builder.append("- 사회성: ").append(prompt.socialization()).append("\n");
        builder.append("- 건강 상태: ").append(prompt.healthStatus()).append("\n");
        builder.append("자기소개 문장 1개만 출력하고, 번호나 부연 설명은 넣지 마.\n");
        return builder.toString();
    }

    public record IntroPrompt(
        String kind,
        String gender,
        String age,
        String weight,
        String color,
        String discoveryPlace,
        String description,
        String socialization,
        String healthStatus
    ) {
    }

    public record IntroResult(String intro) {

        public static IntroResult empty() {
            return new IntroResult(null);
        }
    }

    public record Usage(int promptTokens, int candidateTokens, int totalTokens) {
    }

    public record DebugResult(String prompt, String intro, Usage usage) {
    }

    private record ResponsePayload(IntroResult result, Usage usage) {

        private static ResponsePayload empty() {
            return new ResponsePayload(IntroResult.empty(), null);
        }
    }

}
