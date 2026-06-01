package com.websoftware_26_1.petcare.web;

import com.websoftware_26_1.petcare.service.DbStatsService;
import com.websoftware_26_1.petcare.web.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/stats/v2")
public class DbStatsController {

    private final DbStatsService dbStatsService;

    public DbStatsController(DbStatsService dbStatsService) {
        this.dbStatsService = dbStatsService;
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAllStats() {
        return ResponseEntity.ok(ApiResponse.ok(dbStatsService.getAllStats()));
    }
}
