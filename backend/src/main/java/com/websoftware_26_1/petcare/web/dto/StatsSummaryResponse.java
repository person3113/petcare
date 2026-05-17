package com.websoftware_26_1.petcare.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StatsSummaryResponse {

    private int totalRescued;
    private int totalAdopted;
    private int totalProtecting;
    private int totalEuthanized;
    private Period period;
    private String cachedAt;

    @Getter
    @AllArgsConstructor
    public static class Period {
        private String from;
        private String to;
    }
}
