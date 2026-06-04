package com.websoftware_26_1.petcare.web;

import com.websoftware_26_1.petcare.service.OpenApiSyncService;
import com.websoftware_26_1.petcare.web.dto.ApiResponse;
import com.websoftware_26_1.petcare.web.dto.SyncResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminSyncController {

    private final OpenApiSyncService openApiSyncService;

    public AdminSyncController(OpenApiSyncService openApiSyncService) {
        this.openApiSyncService = openApiSyncService;
    }

    @PostMapping("/sync")
    public ResponseEntity<ApiResponse<SyncResponse>> sync(
        @RequestParam(name = "type", defaultValue = "all") String type,
        @RequestParam(name = "bgnde", required = false) String bgnde,
        @RequestParam(name = "endde", required = false) String endde,
        @RequestParam(name = "numOfRows", defaultValue = "1000") int numOfRows
    ) {
        if ("all".equalsIgnoreCase(type)) {
            LocalDate bgndeDate = parseDateOrDefault(bgnde, LocalDate.of(2024, 6, 1));
            LocalDate enddeDate = parseDateOrDefault(endde, LocalDate.of(2026, 6, 1));
            openApiSyncService.syncAllDataAsync(bgndeDate, enddeDate, numOfRows);
            return ResponseEntity.ok(ApiResponse.ok(new SyncResponse(-1, -1))); // Background process started
        }
        if ("shelters".equalsIgnoreCase(type)) {
            OpenApiSyncService.SyncResult result = openApiSyncService.syncShelters(numOfRows);
            return ResponseEntity.ok(ApiResponse.ok(new SyncResponse(result.getSavedCount(), result.getTotalCount())));
        }
        if ("stats".equalsIgnoreCase(type)) {
            LocalDate bgndeDate = parseDateOrDefault(bgnde, LocalDate.of(2024, 6, 1));
            LocalDate enddeDate = parseDateOrDefault(endde, LocalDate.of(2026, 6, 1));
            OpenApiSyncService.SyncResult result = openApiSyncService.syncRescueStats(bgndeDate, enddeDate, numOfRows);
            return ResponseEntity.ok(ApiResponse.ok(new SyncResponse(result.getSavedCount(), result.getTotalCount())));
        }
        if ("lost".equalsIgnoreCase(type)) {
            LocalDate bgndeDate = parseDateOrDefault(bgnde, LocalDate.of(2024, 6, 1));
            LocalDate enddeDate = parseDateOrDefault(endde, LocalDate.of(2026, 6, 1));
            OpenApiSyncService.SyncResult result = openApiSyncService.syncLostAnimals(bgndeDate, enddeDate, numOfRows);
            return ResponseEntity.ok(ApiResponse.ok(new SyncResponse(result.getSavedCount(), result.getTotalCount())));
        }
        LocalDate bgndeDate = parseDateOrDefault(bgnde, LocalDate.of(2024, 6, 1));
        LocalDate enddeDate = parseDateOrDefault(endde, LocalDate.of(2026, 6, 1));
        OpenApiSyncService.SyncResult result = openApiSyncService.syncAnimalsForPeriod(bgndeDate, enddeDate, numOfRows);
        return ResponseEntity.ok(ApiResponse.ok(new SyncResponse(result.getSavedCount(), result.getTotalCount())));
    }

    private LocalDate parseDateOrDefault(String value, LocalDate defaultValue) {
        if (value == null || value.isBlank()) {
            return defaultValue;
        }
        try {
            return LocalDate.parse(value, DateTimeFormatter.BASIC_ISO_DATE);
        } catch (DateTimeParseException ex) {
            return defaultValue;
        }
    }
}
