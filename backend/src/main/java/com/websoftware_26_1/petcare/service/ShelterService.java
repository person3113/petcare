package com.websoftware_26_1.petcare.service;

import com.websoftware_26_1.petcare.domain.Shelter;
import com.websoftware_26_1.petcare.repository.ShelterRepository;
import com.websoftware_26_1.petcare.web.dto.ShelterResponse;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ShelterService {

    private final ShelterRepository shelterRepository;

    public ShelterService(ShelterRepository shelterRepository) {
        this.shelterRepository = shelterRepository;
    }

    @Transactional(readOnly = true)
    public List<ShelterResponse> getShelterList() {
        List<Shelter> shelters = shelterRepository.findAll();
        List<ShelterResponse> responses = new ArrayList<>();
        for (Shelter shelter : shelters) {
            responses.add(toResponse(shelter));
        }
        return responses;
    }

    private ShelterResponse toResponse(Shelter shelter) {
        return ShelterResponse.builder()
            .id(shelter.getCareRegNo())
            .name(shelter.getCareNm())
            .address(shelter.getCareAddr())
            .tel(shelter.getCareTel())
            .lat(shelter.getLat())
            .lng(shelter.getLng())
            .weekStartTime(shelter.getWeekOprStime())
            .weekEndTime(shelter.getWeekOprEtime())
            .closedDays(shelter.getCloseDay())
            .targetAnimals(shelter.getSaveTrgtAnimal())
            .build();
    }
}
