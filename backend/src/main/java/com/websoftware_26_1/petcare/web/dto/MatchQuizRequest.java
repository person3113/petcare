package com.websoftware_26_1.petcare.web.dto;

import lombok.Getter;

@Getter
public class MatchQuizRequest {

    private String upkind;
    private String sexCd;
    private String neuterYn;
    private String uprCd;
    private String state;
    private Integer page;
    private Integer limit;
}
