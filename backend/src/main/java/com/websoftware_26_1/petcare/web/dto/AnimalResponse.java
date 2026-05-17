package com.websoftware_26_1.petcare.web.dto;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AnimalResponse {

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
    private String shelterName;
    private String shelterTel;
    private String shelterAddr;
    private String jurisdiction;
    private String updatedAt;
}
