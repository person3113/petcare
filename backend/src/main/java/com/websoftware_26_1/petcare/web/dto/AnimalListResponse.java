package com.websoftware_26_1.petcare.web.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AnimalListResponse {

    private List<AnimalResponse> items;
    private PaginationResponse pagination;
}
