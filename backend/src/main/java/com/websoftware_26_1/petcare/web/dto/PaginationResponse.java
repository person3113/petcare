package com.websoftware_26_1.petcare.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PaginationResponse {

    private int page;
    private int limit;
    private int totalCount;
    private int totalPages;
}
