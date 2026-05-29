package com.websoftware_26_1.petcare.web.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class AnimalDetailResponse {

    private String id;
    private String discoveryDate;
    private String discoveryPlace;
    private String kind;
    private String color;
    private String age;
    private String weight;
    private String noticeNumber;
    private String noticeStartDate;
    private String noticeEndDate;
    private List<String> images;
    private String status;
    private String gender;
    private String isNeutered;
    private String description;
    private String socialization;
    private String healthStatus;
    private String shelterName;
    private String shelterTel;
    private String shelterAddr;
    private String jurisdiction;
    private String updatedAt;
    private boolean isLiked;
    private String geminiIntro;
}
