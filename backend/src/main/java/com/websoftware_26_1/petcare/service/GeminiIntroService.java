package com.websoftware_26_1.petcare.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.Collections;
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
            logger.warn("GEMINI_API_KEY is missing. Gemini intro skipped.");
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
        try {
            Map<String, Object> payload = Map.of(
                "contents", List.of(
                    Map.of(
                        "role", "user",
                        "parts", List.of(Map.of("text", buildPrompt(prompt, strict)))
                    )
                ),
                "generationConfig", Map.of(
                    "temperature", 0.9,
                    "topP", 0.9,
                    "maxOutputTokens", 80
                )
            );

            String url = GEMINI_BASE_URL + model + ":generateContent?key=" + apiKey;
            String response = restTemplate.postForObject(url, payload, String.class);
            if (response == null || response.isBlank()) {
                return IntroResult.empty();
            }
            JsonNode root = objectMapper.readTree(response);
            List<String> candidates = extractCandidates(root);
            if (candidates.isEmpty()) {
                return IntroResult.empty();
            }
            String best = pickBest(candidates);
            return new IntroResult(best, candidates);
        } catch (Exception ex) {
            logger.warn("Gemini intro call failed: {}", ex.getMessage());
            return IntroResult.empty();
        }
    }

    private String pickBest(List<String> candidates) {
        if (candidates == null || candidates.isEmpty()) {
            return null;
        }
        for (String candidate : candidates) {
            if (isValidIntro(candidate)) {
                return candidate;
            }
        }
        return candidates.get(0);
    }

    private boolean isValidIntro(String intro) {
        return intro != null && intro.trim().length() >= 12;
    }

    private List<String> extractCandidates(JsonNode root) {
        JsonNode candidates = root.path("candidates");
        if (!candidates.isArray()) {
            return Collections.emptyList();
        }

        List<String> results = new ArrayList<>();
        for (JsonNode candidate : candidates) {
            String text = candidate.path("content").path("parts").path(0).path("text").asText(null);
            results.addAll(splitCandidates(text));
        }
        return results;
    }

    private List<String> splitCandidates(String text) {
        if (text == null || text.isBlank()) {
            return Collections.emptyList();
        }
        String normalized = text.replace("\r", "").trim();
        String[] lines = normalized.split("\n");
        List<String> results = new ArrayList<>();
        for (String line : lines) {
            String cleaned = cleanupLine(line);
            if (cleaned != null && !cleaned.isBlank()) {
                results.add(cleaned);
            }
        }
        if (results.isEmpty()) {
            String single = cleanupLine(normalized);
            if (single != null && !single.isBlank()) {
                results.add(single);
            }
        }
        return results;
    }

    private String cleanupLine(String line) {
        if (line == null) {
            return null;
        }
        String trimmed = line
            .replaceAll("^[0-9]+[).\\s]+", "")
            .replaceAll("^[\\-•]+\\s*", "")
            .trim();
        if (trimmed.length() > 50) {
            return trimmed.substring(0, 50);
        }
        return trimmed;
    }

    private String buildPrompt(IntroPrompt prompt, boolean strict) {
        StringBuilder builder = new StringBuilder();
        builder.append("너는 유기동물 보호소에 있는 동물이야. ");
        builder.append("아래 정보를 바탕으로 입양 가족에게 1줄 자기소개를 해줘. ");
        builder.append("말투는 귀엽고 개성 있게, 의인화된 느낌. ");
        if (strict) {
            builder.append("15~30자, 1문장으로. ");
            builder.append("아주 짧은 인사말 금지. ");
        } else {
            builder.append("12~30자, 1문장으로. ");
        }
        builder.append("종/성격/특징 중 최소 1개는 꼭 포함해줘. ");
        builder.append("서로 다른 버전 3개를 만들어줘. ");
        builder.append("각 줄은 서로 다른 말투로 써줘.\n");
        builder.append("성격 후보: 발랄함, 소심함, 애교많음, 느긋함, 호기심, 의젓함, 장난꾸러기, 수줍음\n");
        builder.append("위 성격 후보 중 2~3개를 랜덤으로 골라 반영해줘.\n");
        builder.append("- 종: ").append(prompt.kind()).append("\n");
        builder.append("- 성별: ").append(prompt.gender()).append("\n");
        builder.append("- 나이: ").append(prompt.age()).append("\n");
        builder.append("- 체중: ").append(prompt.weight()).append("\n");
        builder.append("- 색상: ").append(prompt.color()).append("\n");
        builder.append("- 발견 장소: ").append(prompt.discoveryPlace()).append("\n");
        builder.append("- 특징: ").append(prompt.description()).append("\n");
        builder.append("- 사회성: ").append(prompt.socialization()).append("\n");
        builder.append("- 건강 상태: ").append(prompt.healthStatus()).append("\n");
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

    public record IntroResult(String intro, List<String> candidates) {

        public static IntroResult empty() {
            return new IntroResult(null, Collections.emptyList());
        }
    }
}
