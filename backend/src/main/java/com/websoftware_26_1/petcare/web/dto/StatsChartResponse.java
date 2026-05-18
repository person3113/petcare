package com.websoftware_26_1.petcare.web.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StatsChartResponse {

    private List<StatusCount> statusCounts;
    private List<RegionRatio> regionRatios;
    private StatsSummaryResponse.Period period;
    private String cachedAt;

    @Getter
    @AllArgsConstructor
    public static class StatusCount {
        private String label;
        private int value;
    }

    @Getter
    @AllArgsConstructor
    public static class RegionRatio {
        private String label;
        private double value;
    }
}
