package com.websoftware_26_1.petcare.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AnimalSearchRequest {

    private String upkind;
    private String uprCd;
    private String orgCd;
    private String state;
    private Integer page;
    private Integer limit;
    private String keyword;
}
