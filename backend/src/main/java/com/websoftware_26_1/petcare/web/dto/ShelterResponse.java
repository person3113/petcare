package com.websoftware_26_1.petcare.web.dto;

import java.math.BigDecimal;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ShelterResponse {

    private String id;
    private String name;
    private String address;
    private String tel;
    private BigDecimal lat;
    private BigDecimal lng;
    private String weekStartTime;
    private String weekEndTime;
    private String closedDays;
    private String targetAnimals;
}
