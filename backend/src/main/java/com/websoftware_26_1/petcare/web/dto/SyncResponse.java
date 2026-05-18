package com.websoftware_26_1.petcare.web.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SyncResponse {

    private int savedCount;
    private int totalCount;
}
