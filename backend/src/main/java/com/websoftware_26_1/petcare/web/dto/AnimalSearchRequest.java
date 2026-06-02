package com.websoftware_26_1.petcare.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AnimalSearchRequest {

    private String sido;
    private String sigungu;
    private String shelterName;
    private String kind;
    private String state;
    private Integer page;
    private Integer limit;
    private String keyword;
    private String gender;
    private String isNeutered;
    private Boolean onlySocialized;
    private Boolean onlyHealthy;
}
