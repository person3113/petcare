package com.websoftware_26_1.petcare.web;

import com.websoftware_26_1.petcare.service.ShelterService;
import com.websoftware_26_1.petcare.web.dto.ApiResponse;
import com.websoftware_26_1.petcare.web.dto.ShelterResponse;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/shelters")
public class ShelterController {

    private final ShelterService shelterService;

    public ShelterController(ShelterService shelterService) {
        this.shelterService = shelterService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShelterResponse>>> getShelters() {
        return ResponseEntity.ok(ApiResponse.ok(shelterService.getShelterList()));
    }
}
