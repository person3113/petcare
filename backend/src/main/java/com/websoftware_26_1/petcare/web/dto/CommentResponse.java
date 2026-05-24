package com.websoftware_26_1.petcare.web.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CommentResponse {

    private Long id;
    private Long postId;
    private Long userId;
    private String userNickname;
    private String content;
    private String createdAt;
    private String updatedAt;
}
