package com.websoftware_26_1.petcare.web;

import com.websoftware_26_1.petcare.service.SurveyService;
import com.websoftware_26_1.petcare.web.dto.ApiResponse;
import com.websoftware_26_1.petcare.web.dto.SurveyResultResponse;
import com.websoftware_26_1.petcare.web.dto.SurveySaveRequest;
import com.websoftware_26_1.petcare.web.dto.UserResponse;
import com.websoftware_26_1.petcare.web.exception.AuthException;
import jakarta.servlet.http.HttpSession;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/surveys")
public class SurveyController {

    private static final String LOGIN_USER = "LOGIN_USER";

    private final SurveyService surveyService;

    public SurveyController(SurveyService surveyService) {
        this.surveyService = surveyService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SurveyResultResponse>> saveSurvey(
        @RequestBody SurveySaveRequest request,
        HttpSession session
    ) {
        Long userId = getLoginUserId(session);
        SurveyResultResponse response = surveyService.saveSurvey(userId, request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<SurveyResultResponse>> getMySurvey(HttpSession session) {
        Long userId = getLoginUserId(session);
        Optional<SurveyResultResponse> response = surveyService.getSurvey(userId);
        return ResponseEntity.ok(ApiResponse.ok(response.orElse(null)));
    }

    private Long getLoginUserId(HttpSession session) {
        if (session == null) {
            throw new AuthException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        Object loginUser = session.getAttribute(LOGIN_USER);
        if (loginUser instanceof UserResponse) {
            return ((UserResponse) loginUser).getId();
        }
        throw new AuthException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
}
