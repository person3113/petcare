package com.websoftware_26_1.petcare.service;

import com.websoftware_26_1.petcare.domain.SurveyResult;
import com.websoftware_26_1.petcare.domain.User;
import com.websoftware_26_1.petcare.repository.SurveyResultRepository;
import com.websoftware_26_1.petcare.repository.UserRepository;
import com.websoftware_26_1.petcare.web.dto.SurveyResultResponse;
import com.websoftware_26_1.petcare.web.dto.SurveySaveRequest;
import com.websoftware_26_1.petcare.web.exception.AuthException;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SurveyService {

    private final SurveyResultRepository surveyResultRepository;
    private final UserRepository userRepository;

    public SurveyService(SurveyResultRepository surveyResultRepository, UserRepository userRepository) {
        this.surveyResultRepository = surveyResultRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public SurveyResultResponse saveSurvey(Long userId, SurveySaveRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new AuthException("User not found.", HttpStatus.UNAUTHORIZED));

        SurveyResult surveyResult = surveyResultRepository.findByUserId(userId)
            .orElseGet(() -> SurveyResult.builder().user(user).build());

        surveyResult.updateFrom(
            request.getUpkind(),
            request.getSexCd(),
            request.getNeuterYn(),
            request.getUprCd(),
            request.getState()
        );

        SurveyResult saved = surveyResultRepository.save(surveyResult);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Optional<SurveyResultResponse> getSurvey(Long userId) {
        return surveyResultRepository.findByUserId(userId).map(this::toResponse);
    }

    private SurveyResultResponse toResponse(SurveyResult surveyResult) {
        return SurveyResultResponse.builder()
            .upkind(surveyResult.getQUpkind())
            .sexCd(surveyResult.getQSexCd())
            .neuterYn(surveyResult.getQNeuterYn())
            .uprCd(surveyResult.getQUprCd())
            .state(surveyResult.getQState())
            .build();
    }
}
