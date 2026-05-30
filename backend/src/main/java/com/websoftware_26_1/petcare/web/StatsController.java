package com.websoftware_26_1.petcare.web;

import com.websoftware_26_1.petcare.service.StatsService;
import com.websoftware_26_1.petcare.web.dto.ApiResponse;
import com.websoftware_26_1.petcare.web.dto.StatsChartResponse;
import com.websoftware_26_1.petcare.web.dto.StatsSummaryResponse;
import com.websoftware_26_1.petcare.web.dto.StatsRealtimeResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<StatsSummaryResponse>> getSummary() {
        return ResponseEntity.ok(ApiResponse.ok(statsService.getSummary()));
    }

    @GetMapping("/chart")
    public ResponseEntity<ApiResponse<StatsChartResponse>> getChart() {
        return ResponseEntity.ok(ApiResponse.ok(statsService.getChart()));
    }

    @GetMapping("/realtime-summary")
    public ResponseEntity<ApiResponse<StatsRealtimeResponse>> getRealtimeSummary() {
        return ResponseEntity.ok(ApiResponse.ok(statsService.getRealtimeSummary()));
    }
}
