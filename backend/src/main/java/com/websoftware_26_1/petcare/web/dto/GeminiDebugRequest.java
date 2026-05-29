package com.websoftware_26_1.petcare.web.dto;

import lombok.Getter;

@Getter
public class GeminiDebugRequest {

    private String kind;
    private String gender;
    private String age;
    private String weight;
    private String color;
    private String discoveryPlace;
    private String description;
    private String socialization;
    private String healthStatus;
    private boolean strict;
}
