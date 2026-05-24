package com.websoftware_26_1.petcare.web.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SurveyResultResponse {

    private String upkind;
    private String sexCd;
    private String neuterYn;
    private String uprCd;
    private String state;
}
