package com.websoftware_26_1.petcare.web;

import com.websoftware_26_1.petcare.service.AnimalService;
import com.websoftware_26_1.petcare.web.dto.AnimalDetailResponse;
import com.websoftware_26_1.petcare.web.dto.AnimalListResponse;
import com.websoftware_26_1.petcare.web.dto.AnimalSearchRequest;
import com.websoftware_26_1.petcare.web.dto.ApiResponse;
import com.websoftware_26_1.petcare.web.dto.UserResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/animals")
public class AnimalController {

    private static final String LOGIN_USER = "LOGIN_USER";

    private final AnimalService animalService;

    public AnimalController(AnimalService animalService) {
        this.animalService = animalService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<AnimalListResponse>> getAnimals(
        @RequestParam(name = "upkind", required = false) String upkind,
        @RequestParam(name = "upr_cd", required = false) String uprCd,
        @RequestParam(name = "org_cd", required = false) String orgCd,
        @RequestParam(name = "state", required = false) String state,
        @RequestParam(name = "page", required = false) Integer page,
        @RequestParam(name = "limit", required = false) Integer limit
    ) {
        AnimalSearchRequest request = new AnimalSearchRequest(upkind, uprCd, orgCd, state, page, limit);
        AnimalListResponse response = animalService.getAnimalList(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{desertionNo}")
    public ResponseEntity<ApiResponse<AnimalDetailResponse>> getAnimalDetail(
        @PathVariable String desertionNo,
        HttpSession session
    ) {
        Long userId = null;
        if (session != null) {
            Object loginUser = session.getAttribute(LOGIN_USER);
            if (loginUser instanceof UserResponse) {
                userId = ((UserResponse) loginUser).getId();
            }
        }
        AnimalDetailResponse response = animalService.getAnimalDetail(desertionNo, userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
