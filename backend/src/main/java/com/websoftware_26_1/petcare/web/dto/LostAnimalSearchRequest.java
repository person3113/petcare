package com.websoftware_26_1.petcare.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LostAnimalSearchRequest {
    private String sido;
    private String sigungu;
    private String kind;
    private String gender;
    private Integer page;
    private Integer limit;
    private String keyword;
}
