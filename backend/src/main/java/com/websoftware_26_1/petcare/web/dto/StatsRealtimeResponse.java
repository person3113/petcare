package com.websoftware_26_1.petcare.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatsRealtimeResponse {
    private String todayDate;
    private int totalRescued;
    private int totalAdopted;
    private int totalEuthanized;
    private int totalProtecting;
}
