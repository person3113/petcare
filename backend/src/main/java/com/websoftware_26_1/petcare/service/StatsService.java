package com.websoftware_26_1.petcare.service;

import com.websoftware_26_1.petcare.domain.RescueStatsCache;
import com.websoftware_26_1.petcare.repository.RescueStatsCacheRepository;
import com.websoftware_26_1.petcare.web.dto.StatsChartResponse;
import com.websoftware_26_1.petcare.web.dto.StatsSummaryResponse;
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

    private final RescueStatsCacheRepository rescueStatsCacheRepository;

    public StatsService(RescueStatsCacheRepository rescueStatsCacheRepository) {
        this.rescueStatsCacheRepository = rescueStatsCacheRepository;
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
}
