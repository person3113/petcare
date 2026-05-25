package com.websoftware_26_1.petcare.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GeminiDebugResponse {

    private String prompt;
    private String intro;
    private Integer promptTokens;
    private Integer candidateTokens;
    private Integer totalTokens;
}
