package com.websoftware_26_1.petcare.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.websoftware_26_1.petcare.web.dto.CodeResponse;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class OpenApiClient {

    private static final Logger logger = LoggerFactory.getLogger(OpenApiClient.class);

    private static final String ABANDONMENT_BASE_URL = "https://apis.data.go.kr/1543061/abandonmentPublicService_v2";
    private static final String SHELTER_BASE_URL = "https://apis.data.go.kr/1543061/animalShelterSrvc_v2";
    private static final String STATS_BASE_URL = "https://apis.data.go.kr/1543061/rescueAnimalStatsService";

    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    @Value("${public-data.service-key:}")
    private String serviceKey;

    public OpenApiClient(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.restTemplate = new RestTemplate();
    }

    public List<CodeResponse> fetchSidoCodes() {
        JsonNode root = get(ABANDONMENT_BASE_URL, "/sido_v2", Collections.emptyMap());
        List<JsonNode> items = extractItems(root);
        List<CodeResponse> results = new ArrayList<>();
        for (JsonNode item : items) {
            String code = getText(item, "orgCd");
            String name = getText(item, "orgdownNm");
            if (code != null && name != null) {
                results.add(new CodeResponse(code, name));
            }
        }
        return results;
    }

    public List<CodeResponse> fetchSigunguCodes(String uprCd) {
        JsonNode root = get(ABANDONMENT_BASE_URL, "/sigungu_v2", Map.of("upr_cd", uprCd));
        List<JsonNode> items = extractItems(root);
        List<CodeResponse> results = new ArrayList<>();
        for (JsonNode item : items) {
            String code = getText(item, "orgCd");
            String name = getText(item, "orgdownNm");
            if (code != null && name != null) {
                results.add(new CodeResponse(code, name));
            }
        }
        return results;
    }

    public List<CodeResponse> fetchShelterCodes(String uprCd, String orgCd) {
        JsonNode root = get(ABANDONMENT_BASE_URL, "/shelter_v2", Map.of("upr_cd", uprCd, "org_cd", orgCd));
        List<JsonNode> items = extractItems(root);
        List<CodeResponse> results = new ArrayList<>();
        for (JsonNode item : items) {
            String code = getText(item, "careRegNo");
            String name = getText(item, "careNm");
            if (code != null && name != null) {
                results.add(new CodeResponse(code, name));
            }
        }
        return results;
    }

    public PagedResult fetchAnimals(int pageNo, int numOfRows) {
        JsonNode root = get(ABANDONMENT_BASE_URL, "/abandonmentPublic_v2", Map.of(
            "pageNo", String.valueOf(pageNo),
            "numOfRows", String.valueOf(numOfRows)
        ));
        return toPagedResult(root);
    }

    public PagedResult fetchShelterInfos(int pageNo, int numOfRows) {
        JsonNode root = get(SHELTER_BASE_URL, "/shelterInfo_v2", Map.of(
            "pageNo", String.valueOf(pageNo),
            "numOfRows", String.valueOf(numOfRows)
        ));
        return toPagedResult(root);
    }

    public PagedResult fetchRescueStats(String bgnde, String endde, String se, int pageNo, int numOfRows) {
        JsonNode root = get(STATS_BASE_URL, "/rescueAnimalStats", Map.of(
            "bgnde", bgnde,
            "endde", endde,
            "se", se,
            "pageNo", String.valueOf(pageNo),
            "numOfRows", String.valueOf(numOfRows)
        ));
        return toPagedResult(root);
    }

    private PagedResult toPagedResult(JsonNode root) {
        List<JsonNode> items = extractItems(root);
        int totalCount = root.path("response").path("body").path("totalCount").asInt(0);
        return new PagedResult(items, totalCount);
    }

    private JsonNode get(String baseUrl, String path, Map<String, String> params) {
        if (serviceKey == null || serviceKey.isBlank()) {
            logger.warn("PUBLIC_DATA_API_KEY is missing. Open API call skipped.");
            return objectMapper.createObjectNode();
        }
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(baseUrl + path)
            .queryParam("serviceKey", serviceKey)
            .queryParam("_type", "json");

        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (entry.getValue() != null && !entry.getValue().isBlank()) {
                builder.queryParam(entry.getKey(), entry.getValue());
            }
        }

        String url = builder.build(true).toUriString();
        try {
            String response = restTemplate.getForObject(url, String.class);
            if (response == null || response.isBlank()) {
                return objectMapper.createObjectNode();
            }
            if (response.startsWith("<")) {
                logger.warn("Open API returned non-JSON response.");
                return objectMapper.createObjectNode();
            }
            return objectMapper.readTree(response);
        } catch (Exception ex) {
            logger.warn("Open API call failed: {}", ex.getMessage());
            return objectMapper.createObjectNode();
        }
    }

    private List<JsonNode> extractItems(JsonNode root) {
        JsonNode itemNode = root.path("response").path("body").path("items").path("item");
        if (itemNode.isMissingNode() || itemNode.isNull()) {
            return Collections.emptyList();
        }
        List<JsonNode> items = new ArrayList<>();
        if (itemNode.isArray()) {
            for (JsonNode node : itemNode) {
                items.add(node);
            }
        } else {
            items.add(itemNode);
        }
        return items;
    }

    private String getText(JsonNode node, String field) {
        if (node == null || field == null) {
            return null;
        }
        JsonNode value = node.get(field);
        if (value == null || value.isNull()) {
            return null;
        }
        String text = value.asText();
        return text == null || text.isBlank() ? null : text;
    }

    public static class PagedResult {

        private final List<JsonNode> items;
        private final int totalCount;

        public PagedResult(List<JsonNode> items, int totalCount) {
            this.items = items;
            this.totalCount = totalCount;
        }

        public List<JsonNode> getItems() {
            return items;
        }

        public int getTotalCount() {
            return totalCount;
        }
    }
}
