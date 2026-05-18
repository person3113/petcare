package com.websoftware_26_1.petcare.service;

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

    public CodeCacheService(OpenApiClient openApiClient) {
        this.openApiClient = openApiClient;
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
        sigunguCache.put(uprCd, Collections.unmodifiableList(fetched));
        return fetched;
    }

    public List<CodeResponse> getShelterList(String uprCd, String orgCd) {
        if (uprCd == null || orgCd == null) {
            return Collections.emptyList();
        }
        String key = uprCd + ":" + orgCd;
        List<CodeResponse> cached = shelterCache.get(key);
        if (cached != null) {
            return cached;
        }
        List<CodeResponse> fetched = openApiClient.fetchShelterCodes(uprCd, orgCd);
        shelterCache.put(key, Collections.unmodifiableList(fetched));
        return fetched;
    }
}
