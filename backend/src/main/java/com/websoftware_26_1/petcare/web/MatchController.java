package com.websoftware_26_1.petcare.web;

import com.websoftware_26_1.petcare.service.AnimalService;
import com.websoftware_26_1.petcare.web.dto.AnimalListResponse;
import com.websoftware_26_1.petcare.web.dto.ApiResponse;
import com.websoftware_26_1.petcare.web.dto.MatchQuizRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/match")
public class MatchController {

    private final AnimalService animalService;

    public MatchController(AnimalService animalService) {
        this.animalService = animalService;
    }

    @PostMapping("/quiz")
    public ResponseEntity<ApiResponse<AnimalListResponse>> matchQuiz(@RequestBody MatchQuizRequest request) {
        AnimalListResponse response = animalService.getMatchedAnimals(
            request.getUpkind(),
            request.getUprCd(),
            request.getState(),
            request.getSexCd(),
            request.getNeuterYn(),
            request.getPage(),
            request.getLimit()
        );
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
