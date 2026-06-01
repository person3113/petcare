package com.websoftware_26_1.petcare.web;

import com.websoftware_26_1.petcare.service.DbStatsService;
import com.websoftware_26_1.petcare.web.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/stats/v2")
public class DbStatsController {

    private final DbStatsService dbStatsService;

    public DbStatsController(DbStatsService dbStatsService) {
        this.dbStatsService = dbStatsService;
    }

    @GetMapping("/realtime-summary")
    public ResponseEntity<ApiResponse<com.websoftware_26_1.petcare.web.dto.StatsRealtimeResponse>> getRealtimeSummary() {
        return ResponseEntity.ok(ApiResponse.ok(dbStatsService.getRealtimeSummary()));
    }

    @GetMapping("/global")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getGlobalStats() {
        return ResponseEntity.ok(ApiResponse.ok(dbStatsService.getGlobalStats()));
    }

    @GetMapping("/details")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFilteredStats(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String sido) {
        return ResponseEntity.ok(ApiResponse.ok(dbStatsService.getFilteredStats(startDate, endDate, sido)));
    }
}
