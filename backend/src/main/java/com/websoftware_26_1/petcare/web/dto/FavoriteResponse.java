package com.websoftware_26_1.petcare.web.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FavoriteResponse {

    private Long id;
    private String desertionNo;
    private String kind;
    private String imageUrl;
    private String shelterTel;
    private String processState;
    private String noticeEndDate;
}
