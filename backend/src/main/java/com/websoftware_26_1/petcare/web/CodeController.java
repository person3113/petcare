package com.websoftware_26_1.petcare.web;

import com.websoftware_26_1.petcare.service.CodeCacheService;
import com.websoftware_26_1.petcare.web.dto.ApiResponse;
import com.websoftware_26_1.petcare.web.dto.CodeResponse;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/codes")
public class CodeController {

    private final CodeCacheService codeCacheService;

    public CodeController(CodeCacheService codeCacheService) {
        this.codeCacheService = codeCacheService;
    }

    @GetMapping("/sido")
    public ResponseEntity<ApiResponse<List<CodeResponse>>> getSidoList() {
        return ResponseEntity.ok(ApiResponse.ok(codeCacheService.getSidoList()));
    }

    @GetMapping("/sigungu")
    public ResponseEntity<ApiResponse<List<CodeResponse>>> getSigunguList(
        @RequestParam(name = "uprCd", required = false) String uprCd
    ) {
        return ResponseEntity.ok(ApiResponse.ok(codeCacheService.getSigunguList(uprCd)));
    }

    @GetMapping("/shelters")
    public ResponseEntity<ApiResponse<List<CodeResponse>>> getShelterList(
        @RequestParam(name = "uprCd", required = false) String uprCd,
        @RequestParam(name = "orgCd", required = false) String orgCd
    ) {
        return ResponseEntity.ok(ApiResponse.ok(codeCacheService.getShelterList(uprCd, orgCd)));
    }
}
