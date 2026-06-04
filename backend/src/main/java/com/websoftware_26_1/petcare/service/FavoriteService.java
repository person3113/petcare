package com.websoftware_26_1.petcare.service;

import com.websoftware_26_1.petcare.domain.Animal;
import com.websoftware_26_1.petcare.domain.Favorite;
import com.websoftware_26_1.petcare.domain.User;
import com.websoftware_26_1.petcare.repository.AnimalRepository;
import com.websoftware_26_1.petcare.repository.FavoriteRepository;
import com.websoftware_26_1.petcare.repository.UserRepository;
import com.websoftware_26_1.petcare.web.dto.FavoriteResponse;
import com.websoftware_26_1.petcare.web.exception.AuthException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FavoriteService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final AnimalRepository animalRepository;

    public FavoriteService(
        FavoriteRepository favoriteRepository,
        UserRepository userRepository,
        AnimalRepository animalRepository
    ) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.animalRepository = animalRepository;
    }

    @Transactional(readOnly = true)
    public List<FavoriteResponse> getFavorites(Long userId) {
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);
        List<FavoriteResponse> responses = new ArrayList<>();
        for (Favorite favorite : favorites) {
            responses.add(toResponse(favorite));
        }
        return responses;
    }

    @Transactional(readOnly = true)
    public long getFavoriteCount(Long userId) {
        return favoriteRepository.countByUserId(userId);
    }

    @Transactional
    public FavoriteResponse addFavorite(Long userId, String desertionNo) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new AuthException("User not found.", HttpStatus.UNAUTHORIZED));

        Favorite existing = favoriteRepository.findByUserIdAndDesertionNo(userId, desertionNo)
            .orElse(null);
        if (existing != null) {
            return toResponse(existing);
        }

        Animal animal = animalRepository.findById(desertionNo)
            .orElse(null);

        Favorite favorite = Favorite.builder()
            .user(user)
            .desertionNo(desertionNo)
            .snapKindNm(animal != null ? animal.getKindFullNm() : null)
            .snapImgUrl(animal != null ? firstImage(animal) : null)
            .snapCareTel(animal != null ? animal.getCareTel() : null)
            .snapProcessState(animal != null ? animal.getProcessState() : null)
            .snapNoticeEdt(animal != null ? animal.getNoticeEdt() : null)
            .snapCareNm(animal != null ? animal.getCareNm() : null)
            .snapAge(animal != null ? animal.getAge() : null)
            .snapSexCd(animal != null ? animal.getSexCd() : null)
            .build();

        Favorite saved = favoriteRepository.save(favorite);
        return toResponse(saved);
    }

    @Transactional
    public boolean removeFavorite(Long userId, String desertionNo) {
        int deleted = favoriteRepository.deleteByUserIdAndDesertionNo(userId, desertionNo);
        return deleted > 0;
    }

    private FavoriteResponse toResponse(Favorite favorite) {
        return FavoriteResponse.builder()
            .id(favorite.getId())
            .desertionNo(favorite.getDesertionNo())
            .kind(favorite.getSnapKindNm())
            .imageUrl(favorite.getSnapImgUrl())
            .shelterTel(favorite.getSnapCareTel())
            .processState(favorite.getSnapProcessState())
            .noticeEndDate(formatDate(favorite.getSnapNoticeEdt()))
            .shelterName(favorite.getSnapCareNm())
            .age(favorite.getSnapAge())
            .gender(convertGender(favorite.getSnapSexCd()))
            .build();
    }

    private String formatDate(LocalDate date) {
        if (date == null) {
            return null;
        }
        return date.format(DATE_FORMATTER);
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

    private String firstImage(Animal animal) {
        String popfiles = animal.getPopfiles();
        if (popfiles == null || popfiles.isBlank()) {
            String fallback = animal.getEvntImg();
            return fallback == null || fallback.isBlank() ? null : fallback.trim();
        }
        String[] parts = popfiles.split("[,]");
        if (parts.length == 0) {
            return null;
        }
        String first = parts[0].trim();
        return first.isEmpty() ? null : first;
    }
}
