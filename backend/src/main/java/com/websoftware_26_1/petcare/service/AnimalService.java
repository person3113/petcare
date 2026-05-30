package com.websoftware_26_1.petcare.service;

import com.websoftware_26_1.petcare.domain.Animal;
import com.websoftware_26_1.petcare.domain.Shelter;
import com.websoftware_26_1.petcare.repository.AnimalRepository;
import com.websoftware_26_1.petcare.repository.FavoriteRepository;
import com.websoftware_26_1.petcare.repository.ShelterRepository;
import com.websoftware_26_1.petcare.service.GeminiIntroService.IntroPrompt;
import com.websoftware_26_1.petcare.service.GeminiIntroService.IntroResult;
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
    private final GeminiIntroService geminiIntroService;

    public AnimalService(
        AnimalRepository animalRepository,
        ShelterRepository shelterRepository,
        FavoriteRepository favoriteRepository,
        GeminiIntroService geminiIntroService
    ) {
        this.animalRepository = animalRepository;
        this.shelterRepository = shelterRepository;
        this.favoriteRepository = favoriteRepository;
        this.geminiIntroService = geminiIntroService;
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
        String keyword = request.getKeyword();

        List<Animal> animals = animalRepository.findAllWithFilters(
            upKindCd,
            orgNm,
            careRegNo,
            processState,
            keyword,
            offset,
            limit
        );
        int totalCount = animalRepository.countAllWithFilters(upKindCd, orgNm, careRegNo, processState, keyword);
        int totalPages = (int) Math.ceil((double) totalCount / limit);

        List<AnimalResponse> items = new ArrayList<>();
        for (Animal animal : animals) {
            items.add(toAnimalResponse(animal));
        }

        PaginationResponse pagination = new PaginationResponse(page, limit, totalCount, totalPages);
        return new AnimalListResponse(items, pagination);
    }

    @Transactional(readOnly = true)
    public AnimalListResponse getMatchedAnimals(
        String upkind,
        String uprCd,
        String state,
        String sexCd,
        String neuterYn,
        Integer page,
        Integer limit
    ) {
        int safePage = page == null || page < 1 ? 1 : page;
        int safeLimit = limit == null || limit < 1 ? 20 : limit;
        int offset = (safePage - 1) * safeLimit;

        String upKindCd = upkind;
        String orgNm = uprCd;
        String careRegNo = null;
        String processState = state;

        List<Animal> animals = animalRepository.findAllWithFiltersForMatch(
            upKindCd,
            orgNm,
            careRegNo,
            processState,
            sexCd,
            neuterYn,
            offset,
            safeLimit
        );
        int totalCount = animalRepository.countAllWithFiltersForMatch(
            upKindCd,
            orgNm,
            careRegNo,
            processState,
            sexCd,
            neuterYn
        );
        int totalPages = (int) Math.ceil((double) totalCount / safeLimit);

        List<AnimalResponse> items = new ArrayList<>();
        for (Animal animal : animals) {
            items.add(toAnimalResponse(animal));
        }

        PaginationResponse pagination = new PaginationResponse(safePage, safeLimit, totalCount, totalPages);
        return new AnimalListResponse(items, pagination);
    }

    @Transactional
    public AnimalDetailResponse getAnimalDetail(String desertionNo, Long userId) {
        Animal animal = animalRepository.findById(desertionNo)
            .orElseThrow(() -> new IllegalArgumentException("Animal not found"));

        Optional<Shelter> shelter = Optional.empty();
        if (animal.getCareRegNo() != null) {
            shelter = shelterRepository.findById(animal.getCareRegNo());
        }

        IntroResult introResult = ensureGeminiIntro(animal);

        boolean isLiked = false;
        if (userId != null) {
            isLiked = favoriteRepository.existsByUserIdAndDesertionNo(userId, desertionNo);
        }

        return toAnimalDetailResponse(animal, shelter.orElse(null), isLiked, introResult);
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

    private AnimalDetailResponse toAnimalDetailResponse(
        Animal animal,
        Shelter shelter,
        boolean isLiked,
        IntroResult introResult
    ) {
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
            .geminiIntro(introResult.intro())
            .build();
    }

    private IntroResult ensureGeminiIntro(Animal animal) {
        if (animal.getGeminiIntro() != null && !animal.getGeminiIntro().isBlank()
                && animal.getGeminiIntro().trim().length() >= 12) {
            return new IntroResult(animal.getGeminiIntro());
        }

        IntroPrompt prompt = new IntroPrompt(
            valueOrFallback(animal.getKindFullNm(), animal.getKindNm()),
            convertGender(animal.getSexCd()),
            animal.getAge(),
            animal.getWeight(),
            animal.getColorCd(),
            animal.getHappenPlace(),
            animal.getSpecialMark(),
            animal.getSfeSoci(),
            valueOrFallback(animal.getSfeHealth(), animal.getHealthChk())
        );

        IntroResult result = geminiIntroService.generateIntro(prompt);
        if (result.intro() != null && result.intro().trim().length() >= 12) {
            animal.updateGeminiIntro(result.intro(), LocalDateTime.now());
            animalRepository.save(animal);
        }
        return result;
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
