package com.websoftware_26_1.petcare.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.websoftware_26_1.petcare.domain.RescueStatsCache;
import com.websoftware_26_1.petcare.repository.RescueStatsCacheRepository;
import com.websoftware_26_1.petcare.web.dto.StatsChartResponse;
import com.websoftware_26_1.petcare.web.dto.StatsSummaryResponse;
import com.websoftware_26_1.petcare.web.dto.StatsRealtimeResponse;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StatsService {

    private static final LocalDate DEFAULT_FROM = LocalDate.of(2024, 1, 1);
    private static final LocalDate DEFAULT_TO = LocalDate.of(2026, 1, 1);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.BASIC_ISO_DATE;
    private static final DateTimeFormatter DISPLAY_DATE_FORMATTER = DateTimeFormatter.ofPattern("yy.MM.dd");

    private final RescueStatsCacheRepository rescueStatsCacheRepository;
    private final OpenApiClient openApiClient;

    public StatsService(RescueStatsCacheRepository rescueStatsCacheRepository, OpenApiClient openApiClient) {
        this.rescueStatsCacheRepository = rescueStatsCacheRepository;
        this.openApiClient = openApiClient;
    }

    @Transactional(readOnly = true)
    public StatsSummaryResponse getSummary() {
        List<RescueStatsCache> items = rescueStatsCacheRepository.findByPeriod(DEFAULT_FROM, DEFAULT_TO);

        int totalRescued = 0;
        int totalAdopted = 0;
        int totalProtecting = 0;
        int totalEuthanized = 0;
        LocalDateTime cachedAt = null;

        for (RescueStatsCache item : items) {
            if (!"chart1".equalsIgnoreCase(item.getSe())) {
                continue;
            }
            totalRescued += item.getTot();
            String label = item.getPrcsNm();
            if (label != null) {
                if (label.contains("입양")) {
                    totalAdopted += item.getTot();
                } else if (label.contains("보호")) {
                    totalProtecting += item.getTot();
                } else if (label.contains("안락")) {
                    totalEuthanized += item.getTot();
                }
            }
            if (cachedAt == null || item.getCachedAt().isAfter(cachedAt)) {
                cachedAt = item.getCachedAt();
            }
        }

        StatsSummaryResponse.Period period = new StatsSummaryResponse.Period(
            DEFAULT_FROM.format(DATE_FORMATTER),
            DEFAULT_TO.format(DATE_FORMATTER)
        );
        String cachedAtValue = cachedAt == null ? null : cachedAt.toString();
        return new StatsSummaryResponse(
            totalRescued,
            totalAdopted,
            totalProtecting,
            totalEuthanized,
            period,
            cachedAtValue
        );
    }

    @Transactional(readOnly = true)
    public StatsChartResponse getChart() {
        List<RescueStatsCache> items = rescueStatsCacheRepository.findByPeriod(DEFAULT_FROM, DEFAULT_TO);

        List<StatsChartResponse.StatusCount> statusCounts = new ArrayList<>();
        List<StatsChartResponse.RegionRatio> regionRatios = new ArrayList<>();
        LocalDateTime cachedAt = null;

        for (RescueStatsCache item : items) {
            if ("chart1".equalsIgnoreCase(item.getSe())) {
                statusCounts.add(new StatsChartResponse.StatusCount(item.getPrcsNm(), item.getTot()));
            } else if ("chart2".equalsIgnoreCase(item.getSe())) {
                regionRatios.add(new StatsChartResponse.RegionRatio(item.getPrcsNm(), item.getTot()));
            }

            if (cachedAt == null || item.getCachedAt().isAfter(cachedAt)) {
                cachedAt = item.getCachedAt();
            }
        }

        StatsSummaryResponse.Period period = new StatsSummaryResponse.Period(
            DEFAULT_FROM.format(DATE_FORMATTER),
            DEFAULT_TO.format(DATE_FORMATTER)
        );
        String cachedAtValue = cachedAt == null ? null : cachedAt.toString();
        return new StatsChartResponse(statusCounts, regionRatios, period, cachedAtValue);
    }

    @Transactional
    public void refreshStatsCache(List<RescueStatsCache> items, LocalDate bgnde, LocalDate endde) {
        rescueStatsCacheRepository.deleteByPeriod(bgnde, endde);
        for (RescueStatsCache item : items) {
            rescueStatsCacheRepository.save(item);
        }
    }

    private StatsRealtimeResponse cachedRealtimeResponse;
    private LocalDate lastCachedDate;

    public StatsRealtimeResponse getRealtimeSummary() {
        LocalDate today = LocalDate.now();
        
        // 오늘 날짜로 이미 캐시된 데이터가 있다면 API를 호출하지 않고 바로 반환 (간단한 인메모리 캐싱)
        if (cachedRealtimeResponse != null && today.equals(lastCachedDate)) {
            return cachedRealtimeResponse;
        }

        LocalDate pastMonth = today.minusDays(30);

        String bgnde = pastMonth.format(DATE_FORMATTER);
        String endde = today.format(DATE_FORMATTER);
        String displayDate = today.format(DISPLAY_DATE_FORMATTER);

        int totalRescued = 0;
        int totalAdopted = 0;
        int totalEuthanized = 0;
        int totalProtecting = 0;

        int pageNo = 1;
        int numOfRows = 1000;

        while (true) {
            OpenApiClient.PagedResult result = openApiClient.fetchRescueStats(bgnde, endde, "chart1", pageNo, numOfRows);
            if (result == null || result.getItems().isEmpty()) {
                break;
            }

            for (JsonNode item : result.getItems()) {
                String prcsNm = item.path("prcsNm").asText();
                String totStr = item.path("tot").asText();
                int tot = parseNumber(totStr);
                
                totalRescued += tot;
                if (prcsNm.contains("입양")) {
                    totalAdopted += tot;
                } else if (prcsNm.contains("안락")) {
                    totalEuthanized += tot;
                } else if (prcsNm.contains("보호")) {
                    totalProtecting += tot;
                }
            }

            if (pageNo * numOfRows >= result.getTotalCount()) {
                break;
            }
            pageNo++;
        }

        StatsRealtimeResponse response = new StatsRealtimeResponse(displayDate, totalRescued, totalAdopted, totalEuthanized, totalProtecting);
        
        // API 호출 결과를 변수에 저장하여 다음 요청 시 재사용
        this.cachedRealtimeResponse = response;
        this.lastCachedDate = today;
        
        return response;
    }

    private int parseNumber(String value) {
        if (value == null || value.isBlank()) {
            return 0;
        }
        try {
            String normalized = value.replaceAll("[^0-9]", "").trim();
            if (normalized.isEmpty()) return 0;
            return Integer.parseInt(normalized);
        } catch (Exception ex) {
            return 0;
        }
    }
}
