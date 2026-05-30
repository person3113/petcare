package com.websoftware_26_1.petcare.service;

import com.websoftware_26_1.petcare.domain.LostAnimal;
import com.websoftware_26_1.petcare.repository.LostAnimalRepository;
import com.websoftware_26_1.petcare.web.dto.LostAnimalResponse;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LostAnimalService {

    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.S");

    private final LostAnimalRepository lostAnimalRepository;

    public LostAnimalService(LostAnimalRepository lostAnimalRepository) {
        this.lostAnimalRepository = lostAnimalRepository;
    }

    @Transactional(readOnly = true)
    public List<LostAnimalResponse> getLostAnimals() {
        List<LostAnimal> animals = lostAnimalRepository.findAll();
        List<LostAnimalResponse> results = new ArrayList<>();
        for (LostAnimal animal : animals) {
            results.add(toResponse(animal));
        }
        return results;
    }

    @Transactional(readOnly = true)
    public LostAnimalResponse getLostAnimalDetail(Long id) {
        LostAnimal animal = lostAnimalRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Lost animal not found"));
        return toResponse(animal);
    }

    private LostAnimalResponse toResponse(LostAnimal animal) {
        List<String> images = new ArrayList<>();
        if (animal.getPopfile() != null && !animal.getPopfile().isBlank()) {
            images.add(animal.getPopfile());
        }

        String discoveryPlace = valueOrFallback(animal.getHappenAddr(), animal.getHappenPlace());
        if (animal.getHappenAddrDtl() != null && !animal.getHappenAddrDtl().isBlank()) {
            discoveryPlace = discoveryPlace + " " + animal.getHappenAddrDtl();
        }

        return new LostAnimalResponse(
            animal.getId(),
            formatDateTime(animal.getHappenDt()),
            discoveryPlace,
            animal.getKindCd(),
            animal.getColorCd(),
            animal.getAge(),
            null,
            null,
            null,
            null,
            images,
            "분실",
            convertGender(animal.getSexCd()),
            null,
            animal.getSpecialMark(),
            animal.getOrgNm(),
            animal.getCallTel(),
            discoveryPlace,
            animal.getOrgNm(),
            "",
            "양호",
            formatDateTime(animal.getCachedAt())
        );
    }

    private String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DATETIME_FORMATTER);
    }

    private String convertGender(String sexCd) {
        if (sexCd == null) {
            return null;
        }
        if ("M".equalsIgnoreCase(sexCd)) {
            return "수컷";
        }
        if ("F".equalsIgnoreCase(sexCd)) {
            return "암컷";
        }
        return sexCd;
    }

    private String valueOrFallback(String primary, String fallback) {
        if (primary != null && !primary.isBlank()) {
            return primary;
        }
        return fallback;
    }
}
