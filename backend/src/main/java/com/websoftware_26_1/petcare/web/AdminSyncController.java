package com.websoftware_26_1.petcare.web;

import com.websoftware_26_1.petcare.service.OpenApiSyncService;
import com.websoftware_26_1.petcare.web.dto.ApiResponse;
import com.websoftware_26_1.petcare.web.dto.SyncResponse;
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
        @RequestParam(name = "type", defaultValue = "animals") String type,
        @RequestParam(name = "numOfRows", defaultValue = "200") int numOfRows
    ) {
        if ("shelters".equalsIgnoreCase(type)) {
            OpenApiSyncService.SyncResult result = openApiSyncService.syncShelters(numOfRows);
            return ResponseEntity.ok(ApiResponse.ok(new SyncResponse(result.getSavedCount(), result.getTotalCount())));
        }
        OpenApiSyncService.SyncResult result = openApiSyncService.syncAnimals(numOfRows);
        return ResponseEntity.ok(ApiResponse.ok(new SyncResponse(result.getSavedCount(), result.getTotalCount())));
    }
}
