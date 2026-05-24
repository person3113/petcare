package com.websoftware_26_1.petcare.web.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PostResponse {

    private Long id;
    private String title;
    private String content;
    private String category;
    private Long userId;
    private String userNickname;
    private String createdAt;
    private String updatedAt;
}
