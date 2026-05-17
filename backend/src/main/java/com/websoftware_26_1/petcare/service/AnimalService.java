package com.websoftware_26_1.petcare.service;

import com.websoftware_26_1.petcare.domain.Animal;
import com.websoftware_26_1.petcare.domain.Shelter;
import com.websoftware_26_1.petcare.repository.AnimalRepository;
import com.websoftware_26_1.petcare.repository.FavoriteRepository;
import com.websoftware_26_1.petcare.repository.ShelterRepository;
import com.websoftware_26_1.petcare.web.dto.AnimalDetailResponse;
import com.websoftware_26_1.petcare.web.dto.AnimalListResponse;
import com.websoftware_26_1.petcare.web.dto.AnimalResponse;
import com.websoftware_26_1.petcare.web.dto.AnimalSearchRequest;
import com.websoftware_26_1.petcare.web.dto.PaginationResponse;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AnimalService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.S");

    private final AnimalRepository animalRepository;
    private final ShelterRepository shelterRepository;
    private final FavoriteRepository favoriteRepository;

    public AnimalService(
        AnimalRepository animalRepository,
        ShelterRepository shelterRepository,
        FavoriteRepository favoriteRepository
    ) {
        this.animalRepository = animalRepository;
        this.shelterRepository = shelterRepository;
        this.favoriteRepository = favoriteRepository;
    }

    @Transactional(readOnly = true)
    public AnimalListResponse getAnimalList(AnimalSearchRequest request) {
        int page = request.getPage() == null || request.getPage() < 1 ? 1 : request.getPage();
        int limit = request.getLimit() == null || request.getLimit() < 1 ? 20 : request.getLimit();
        int offset = (page - 1) * limit;

        String upKindCd = request.getUpkind();
        String orgNm = request.getOrgCd();
        String careRegNo = null;
        String processState = request.getState();

        List<Animal> animals = animalRepository.findAllWithFilters(
            upKindCd,
            orgNm,
            careRegNo,
            processState,
            offset,
            limit
        );
        int totalCount = animalRepository.countAllWithFilters(upKindCd, orgNm, careRegNo, processState);
        int totalPages = (int) Math.ceil((double) totalCount / limit);

        List<AnimalResponse> items = new ArrayList<>();
        for (Animal animal : animals) {
            items.add(toAnimalResponse(animal));
        }

        PaginationResponse pagination = new PaginationResponse(page, limit, totalCount, totalPages);
        return new AnimalListResponse(items, pagination);
    }

    @Transactional(readOnly = true)
    public AnimalDetailResponse getAnimalDetail(String desertionNo, Long userId) {
        Animal animal = animalRepository.findById(desertionNo)
            .orElseThrow(() -> new IllegalArgumentException("Animal not found"));

        Optional<Shelter> shelter = Optional.empty();
        if (animal.getCareRegNo() != null) {
            shelter = shelterRepository.findById(animal.getCareRegNo());
        }

        boolean isLiked = false;
        if (userId != null) {
            isLiked = favoriteRepository.existsByUserIdAndDesertionNo(userId, desertionNo);
        }

        return toAnimalDetailResponse(animal, shelter.orElse(null), isLiked);
    }

    private AnimalResponse toAnimalResponse(Animal animal) {
        return AnimalResponse.builder()
            .id(animal.getDesertionNo())
            .discoveryDate(formatDate(animal.getHappenDt()))
            .discoveryPlace(animal.getHappenPlace())
            .kind(valueOrFallback(animal.getKindFullNm(), animal.getKindNm()))
            .color(animal.getColorCd())
            .age(animal.getAge())
            .weight(animal.getWeight())
            .noticeNumber(animal.getNoticeNo())
            .noticeStartDate(formatDate(animal.getNoticeSdt()))
            .noticeEndDate(formatDate(animal.getNoticeEdt()))
            .images(parseImages(animal.getPopfiles(), animal.getEvntImg()))
            .status(animal.getProcessState())
            .gender(convertGender(animal.getSexCd()))
            .isNeutered(convertNeuter(animal.getNeuterYn()))
            .description(animal.getSpecialMark())
            .shelterName(animal.getCareNm())
            .shelterTel(animal.getCareTel())
            .shelterAddr(animal.getCareAddr())
            .jurisdiction(animal.getOrgNm())
            .updatedAt(formatDateTime(animal.getUpdTm()))
            .build();
    }

    private AnimalDetailResponse toAnimalDetailResponse(Animal animal, Shelter shelter, boolean isLiked) {
        String shelterName = shelter != null ? shelter.getCareNm() : animal.getCareNm();
        String shelterTel = shelter != null ? shelter.getCareTel() : animal.getCareTel();
        String shelterAddr = shelter != null ? shelter.getCareAddr() : animal.getCareAddr();
        String jurisdiction = shelter != null ? shelter.getOrgNm() : animal.getOrgNm();

        return AnimalDetailResponse.builder()
            .id(animal.getDesertionNo())
            .discoveryDate(formatDate(animal.getHappenDt()))
            .discoveryPlace(animal.getHappenPlace())
            .kind(valueOrFallback(animal.getKindFullNm(), animal.getKindNm()))
            .color(animal.getColorCd())
            .age(animal.getAge())
            .weight(animal.getWeight())
            .noticeNumber(animal.getNoticeNo())
            .noticeStartDate(formatDate(animal.getNoticeSdt()))
            .noticeEndDate(formatDate(animal.getNoticeEdt()))
            .images(parseImages(animal.getPopfiles(), animal.getEvntImg()))
            .status(animal.getProcessState())
            .gender(convertGender(animal.getSexCd()))
            .isNeutered(convertNeuter(animal.getNeuterYn()))
            .description(animal.getSpecialMark())
            .socialization(animal.getSfeSoci())
            .healthStatus(valueOrFallback(animal.getSfeHealth(), animal.getHealthChk()))
            .shelterName(shelterName)
            .shelterTel(shelterTel)
            .shelterAddr(shelterAddr)
            .jurisdiction(jurisdiction)
            .updatedAt(formatDateTime(animal.getUpdTm()))
            .isLiked(isLiked)
            .build();
    }

    private List<String> parseImages(String popfiles, String fallback) {
        List<String> images = new ArrayList<>();
        if (popfiles != null && !popfiles.isBlank()) {
            String[] parts = popfiles.split("[,]");
            for (String part : parts) {
                String trimmed = part.trim();
                if (!trimmed.isEmpty()) {
                    images.add(trimmed);
                }
            }
        }
        if (images.isEmpty() && fallback != null && !fallback.isBlank()) {
            images.add(fallback.trim());
        }
        return images.isEmpty() ? Collections.emptyList() : images;
    }

    private String formatDate(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.format(DATE_FORMATTER);
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
        if ("Q".equalsIgnoreCase(sexCd)) {
            return "미상";
        }
        return sexCd;
    }

    private String convertNeuter(String neuterYn) {
        if (neuterYn == null) {
            return null;
        }
        if ("Y".equalsIgnoreCase(neuterYn)) {
            return "예";
        }
        if ("N".equalsIgnoreCase(neuterYn)) {
            return "아니오";
        }
        if ("U".equalsIgnoreCase(neuterYn)) {
            return "미상";
        }
        return neuterYn;
    }

    private String valueOrFallback(String primary, String fallback) {
        if (primary != null && !primary.isBlank()) {
            return primary;
        }
        return fallback;
    }
}
