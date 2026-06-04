package com.websoftware_26_1.petcare.web;

import com.websoftware_26_1.petcare.service.LostAnimalService;
import com.websoftware_26_1.petcare.web.dto.ApiResponse;
import com.websoftware_26_1.petcare.web.dto.LostAnimalResponse;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/lost-animals")
public class LostAnimalController {

    private final LostAnimalService lostAnimalService;

    public LostAnimalController(LostAnimalService lostAnimalService) {
        this.lostAnimalService = lostAnimalService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LostAnimalResponse>>> getLostAnimals(
        @org.springframework.web.bind.annotation.RequestParam(name = "keyword", required = false) String keyword
    ) {
        return ResponseEntity.ok(ApiResponse.ok(lostAnimalService.getLostAnimals(keyword)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LostAnimalResponse>> getLostAnimalDetail(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(lostAnimalService.getLostAnimalDetail(id)));
    }
}
