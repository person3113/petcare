package com.websoftware_26_1.petcare.service;

import com.websoftware_26_1.petcare.domain.Shelter;
import com.websoftware_26_1.petcare.repository.ShelterRepository;

import com.websoftware_26_1.petcare.web.dto.CodeResponse;
import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class CodeCacheService {

    private final Map<String, List<CodeResponse>> sigunguCache = new HashMap<>();
    private final Map<String, List<CodeResponse>> shelterCache = new HashMap<>();
    private List<CodeResponse> sidoCache = new ArrayList<>();

    private final OpenApiClient openApiClient;
    private final ShelterRepository shelterRepository;

    public CodeCacheService(OpenApiClient openApiClient, ShelterRepository shelterRepository) {
        this.openApiClient = openApiClient;
        this.shelterRepository = shelterRepository;
    }

    @PostConstruct
    public void init() {
        List<CodeResponse> sido = openApiClient.fetchSidoCodes();
        if (sido.isEmpty()) {
            this.sidoCache = Collections.emptyList();
            return;
        }
        this.sidoCache = Collections.unmodifiableList(sido);
    }

    public List<CodeResponse> getSidoList() {
        return sidoCache;
    }

    public List<CodeResponse> getSigunguList(String uprCd) {
        if (uprCd == null) {
            return Collections.emptyList();
        }
        List<CodeResponse> cached = sigunguCache.get(uprCd);
        if (cached != null) {
            return cached;
        }
        List<CodeResponse> fetched = openApiClient.fetchSigunguCodes(uprCd);

        String sidoName = sidoCache.stream()
                .filter(s -> s.getCode().equals(uprCd))
                .map(CodeResponse::getName)
                .findFirst()
                .orElse("");

        List<CodeResponse> filtered = fetched.stream()
                .filter(c -> !c.getName().equals(sidoName) && !c.getName().contains("가정보호"))
                .toList();

        sigunguCache.put(uprCd, Collections.unmodifiableList(filtered));
        return filtered;
    }

    public List<CodeResponse> getShelterList(String sido, String sigungu) {
        if (sido == null || sido.isBlank()) {
            return Collections.emptyList();
        }
        
        String prefix = sido;
        if (sigungu != null && !sigungu.isBlank()) {
            prefix = sido + " " + sigungu;
        }

        List<Shelter> shelters = shelterRepository.findByOrgNmStartingWith(prefix);
        
        Map<String, CodeResponse> map = new java.util.LinkedHashMap<>();
        for (Shelter s : shelters) {
            if (!map.containsKey(s.getCareNm())) {
                map.put(s.getCareNm(), new CodeResponse(s.getCareRegNo(), s.getCareNm()));
            }
        }
        return new ArrayList<>(map.values());
    }
}
