package com.websoftware_26_1.petcare.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.websoftware_26_1.petcare.domain.Animal;
import com.websoftware_26_1.petcare.domain.LostAnimal;
import com.websoftware_26_1.petcare.domain.RescueStatsCache;
import com.websoftware_26_1.petcare.domain.Shelter;
import com.websoftware_26_1.petcare.repository.AnimalRepository;
import com.websoftware_26_1.petcare.repository.LostAnimalRepository;
import com.websoftware_26_1.petcare.repository.RescueStatsCacheRepository;
import com.websoftware_26_1.petcare.repository.ShelterRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OpenApiSyncService {

    private static final Logger logger = LoggerFactory.getLogger(OpenApiSyncService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.BASIC_ISO_DATE;
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final DateTimeFormatter LOST_DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.S");

    private final OpenApiClient openApiClient;
    private final AnimalRepository animalRepository;
    private final LostAnimalRepository lostAnimalRepository;
    private final ShelterRepository shelterRepository;
    private final RescueStatsCacheRepository rescueStatsCacheRepository;

    public OpenApiSyncService(
        OpenApiClient openApiClient,
        AnimalRepository animalRepository,
        LostAnimalRepository lostAnimalRepository,
        ShelterRepository shelterRepository,
        RescueStatsCacheRepository rescueStatsCacheRepository
    ) {
        this.openApiClient = openApiClient;
        this.animalRepository = animalRepository;
        this.lostAnimalRepository = lostAnimalRepository;
        this.shelterRepository = shelterRepository;
        this.rescueStatsCacheRepository = rescueStatsCacheRepository;
    }

    @org.springframework.scheduling.annotation.Async
    @Transactional
    public void syncAllDataAsync(LocalDate startDate, LocalDate endDate, int numOfRows) {
        logger.info("background 동기화 시작: from {} to {} ", startDate, endDate);
        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            LocalDate next = current.plusMonths(1).minusDays(1);
            if (next.isAfter(endDate)) {
                next = endDate;
            }
            logger.info("chunk 동기화: {} to {}", current, next);
            syncAnimalsForPeriod(current, next, numOfRows);
            syncLostAnimals(current, next, numOfRows);
            syncRescueStats(current, next, numOfRows);
            current = current.plusMonths(1);
        }
        logger.info("Background 동기화 완료: from {} to {}", startDate, endDate);
    }

    @Transactional
    public SyncResult syncAnimalsForPeriod(LocalDate bgnde, LocalDate endde, int numOfRows) {
        int pageNo = 1;
        int totalCount = 0;
        int savedCount = 0;

        while (true) {
            OpenApiClient.PagedResult result = openApiClient.fetchAnimals(
                bgnde == null ? null : bgnde.format(DATE_FORMATTER),
                endde == null ? null : endde.format(DATE_FORMATTER),
                pageNo, numOfRows
            );
            if (result.getItems().isEmpty()) {
                break;
            }
            if (totalCount == 0) {
                totalCount = result.getTotalCount();
            }

            for (JsonNode item : result.getItems()) {
                Animal animal = toAnimal(item);
                if (animal != null) {
                    animalRepository.save(animal);
                    savedCount++;
                }
            }

            if (pageNo * numOfRows >= totalCount) {
                break;
            }
            pageNo++;
        }

        return new SyncResult(savedCount, totalCount);
    }

    @Transactional
    public SyncResult syncShelters(int numOfRows) {
        int pageNo = 1;
        int totalCount = 0;
        int savedCount = 0;

        while (true) {
            OpenApiClient.PagedResult result = openApiClient.fetchShelterInfos(pageNo, numOfRows);
            if (result.getItems().isEmpty()) {
                break;
            }
            if (totalCount == 0) {
                totalCount = result.getTotalCount();
            }

            for (JsonNode item : result.getItems()) {
                Shelter shelter = toShelter(item);
                if (shelter != null) {
                    shelterRepository.save(shelter);
                    savedCount++;
                }
            }

            if (pageNo * numOfRows >= totalCount) {
                break;
            }
            pageNo++;
        }

        return new SyncResult(savedCount, totalCount);
    }

    @Transactional
    public SyncResult syncLostAnimals(LocalDate bgnde, LocalDate ended, int numOfRows) {
        int pageNo = 1;
        int totalCount = 0;
        int savedCount = 0;

        while (true) {
            OpenApiClient.PagedResult result = openApiClient.fetchLostAnimals(
                bgnde == null ? null : bgnde.format(DATE_FORMATTER),
                ended == null ? null : ended.format(DATE_FORMATTER),
                pageNo,
                numOfRows
            );
            if (result.getItems().isEmpty()) {
                break;
            }
            if (totalCount == 0) {
                totalCount = result.getTotalCount();
            }

            for (JsonNode item : result.getItems()) {
                LostAnimal parsed = toLostAnimal(item);
                if (parsed != null) {
                    LostAnimal existing = lostAnimalRepository.findExisting(parsed).orElse(null);
                    if (existing != null) {
                        parsed.setId(existing.getId());
                        parsed.setCachedAt(existing.getCachedAt());
                    }
                    lostAnimalRepository.save(parsed);
                    savedCount++;
                }
            }

            if (pageNo * numOfRows >= totalCount) {
                break;
            }
            pageNo++;
        }

        return new SyncResult(savedCount, totalCount);
    }

    @Transactional
    public SyncResult syncRescueStats(LocalDate bgnde, LocalDate endde, int numOfRows) {
        if (bgnde == null || endde == null) {
            return new SyncResult(0, 0);
        }

        rescueStatsCacheRepository.deleteByPeriod(bgnde, endde);

        int pageNo = 1;
        int totalCount = 0;
        int savedCount = 0;

        List<String> seList = List.of("chart1", "chart2");
        for (String se : seList) {
            pageNo = 1;
            int seTotalCount = 0;

            while (true) {
                OpenApiClient.PagedResult result = openApiClient.fetchRescueStats(
                    bgnde.format(DATE_FORMATTER),
                    endde.format(DATE_FORMATTER),
                    se,
                    pageNo,
                    numOfRows
                );
                if (result.getItems().isEmpty()) {
                    break;
                }
                if (seTotalCount == 0) {
                    seTotalCount = result.getTotalCount();
                    totalCount += seTotalCount;
                }

                for (JsonNode item : result.getItems()) {
                    RescueStatsCache stats = toRescueStats(item, bgnde, endde, se);
                    if (stats != null) {
                        rescueStatsCacheRepository.save(stats);
                        savedCount++;
                    }
                }

                if (pageNo * numOfRows >= seTotalCount) {
                    break;
                }
                pageNo++;
            }
        }

        return new SyncResult(savedCount, totalCount);
    }

    private Animal toAnimal(JsonNode item) {
        String desertionNo = getText(item, "desertionNo");
        if (desertionNo == null) {
            return null;
        }
        Animal existing = animalRepository.findById(desertionNo).orElse(null);
        LocalDate happenDt = parseDate(getText(item, "happenDt"));
        LocalDate noticeSdt = parseDate(getText(item, "noticeSdt"));
        LocalDate noticeEdt = parseDate(getText(item, "noticeEdt"));
        LocalDate adptnSDate = parseDate(getText(item, "adptnSDate"));
        LocalDate adptnEDate = parseDate(getText(item, "adptnEDate"));
        LocalDate sprtSDate = parseDate(getText(item, "sprtSDate"));
        LocalDate sprtEDate = parseDate(getText(item, "sprtEDate"));
        LocalDateTime updTm = parseDateTime(getText(item, "updTm"));

        List<String> popfiles = new ArrayList<>();
        for (int i = 1; i <= 5; i++) {
            String value = getText(item, "popfile" + i);
            if (value != null) {
                popfiles.add(value);
            }
        }
        String popfilesValue = popfiles.isEmpty() ? null : String.join(",", popfiles);

        String evntImg = getText(item, "evntImg");
        String geminiIntro = existing != null ? existing.getGeminiIntro() : null;
        LocalDateTime cachedAt = LocalDateTime.now();

        return Animal.builder()
            .desertionNo(desertionNo)
            .rfidCd(getText(item, "rfidCd"))
            .noticeNo(getText(item, "noticeNo"))
            .happenDt(happenDt)
            .happenPlace(getText(item, "happenPlace"))
            .upKindCd(getText(item, "upKindCd"))
            .upKindNm(getText(item, "upKindNm"))
            .kindCd(getText(item, "kindCd"))
            .kindNm(getText(item, "kindNm"))
            .kindFullNm(getText(item, "kindFullNm"))
            .colorCd(getText(item, "colorCd"))
            .age(getText(item, "age"))
            .weight(getText(item, "weight"))
            .noticeSdt(noticeSdt)
            .noticeEdt(noticeEdt)
            .processState(getText(item, "processState"))
            .endReason(getText(item, "endReason"))
            .sexCd(getText(item, "sexCd"))
            .neuterYn(getText(item, "neuterYn"))
            .specialMark(getText(item, "specialMark"))
            .sfeSoci(getText(item, "sfeSoci"))
            .sfeHealth(getText(item, "sfeHealth"))
            .vaccinationChk(getText(item, "vaccinationChk"))
            .healthChk(getText(item, "healthChk"))
            .popfiles(popfilesValue)
            .evntImg(evntImg)
            .adptnTitle(getText(item, "adptnTitle"))
            .adptnTxt(getText(item, "adptnTxt"))
            .adptnConditionLimitTxt(getText(item, "adptnConditionLimitTxt"))
            .adptnImg(getText(item, "adptnImg"))
            .adptnSDate(adptnSDate)
            .adptnEDate(adptnEDate)
            .sprtSDate(sprtSDate)
            .sprtEDate(sprtEDate)
            .srvcTxt(getText(item, "srvcTxt"))
            .careRegNo(getText(item, "careRegNo"))
            .careNm(getText(item, "careNm"))
            .careTel(getText(item, "careTel"))
            .careAddr(getText(item, "careAddr"))
            .careOwnerNm(getText(item, "careOwnerNm"))
            .orgNm(getText(item, "orgNm"))
            .etcBigo(getText(item, "etcBigo"))
            .updTm(updTm)
            .geminiIntro(geminiIntro)
            .cachedAt(cachedAt)
            .build();
    }

    private RescueStatsCache toRescueStats(JsonNode item, LocalDate bgnde, LocalDate endde, String se) {
        String prcsNm = getText(item, "prcsNm");
        String totValue = getText(item, "tot");
        if (prcsNm == null || totValue == null) {
            return null;
        }
        Integer tot = parseNumber(totValue);
        if (tot == null) {
            return null;
        }
        return RescueStatsCache.builder()
            .se(se)
            .prcsCd(null)
            .prcsNm(prcsNm)
            .tot(tot)
            .bgnde(bgnde)
            .endde(endde)
            .cachedAt(LocalDateTime.now())
            .build();
    }

    private Shelter toShelter(JsonNode item) {
        String careRegNo = getText(item, "careRegNo");
        if (careRegNo == null) {
            return null;
        }
        return Shelter.builder()
            .careRegNo(careRegNo)
            .careNm(getText(item, "careNm"))
            .orgNm(getText(item, "orgNm"))
            .divisionNm(getText(item, "divisionNm"))
            .saveTrgtAnimal(getText(item, "saveTrgtAnimal"))
            .careAddr(getText(item, "careAddr"))
            .jibunAddr(getText(item, "jibunAddr"))
            .lat(getDecimal(item, "lat"))
            .lng(getDecimal(item, "lng"))
            .weekOprStime(getText(item, "weekOprStime"))
            .weekOprEtime(getText(item, "weekOprEtime"))
            .weekCellStime(getText(item, "weekCellStime"))
            .weekCellEtime(getText(item, "weekCellEtime"))
            .weekendOprStime(getText(item, "weekendOprStime"))
            .weekendOprEtime(getText(item, "weekendOprEtime"))
            .weekendCellStime(getText(item, "weekendCellStime"))
            .weekendCellEtime(getText(item, "weekendCellEtime"))
            .closeDay(getText(item, "closeDay"))
            .vetPersonCnt(getInteger(item, "vetPersonCnt"))
            .specsPersonCnt(getInteger(item, "specsPersonCnt"))
            .medicalCnt(getInteger(item, "medicalCnt"))
            .breedCnt(getInteger(item, "breedCnt"))
            .quarabtineCnt(getInteger(item, "quarabtineCnt"))
            .feedCnt(getInteger(item, "feedCnt"))
            .transCarCnt(getInteger(item, "transCarCnt"))
            .careTel(getText(item, "careTel"))
            .designationDate(parseDate(getText(item, "designationDate")))
            .dataStdDt(parseDate(getText(item, "dataStdDt")))
            .cachedAt(LocalDateTime.now())
            .build();
    }

    private LostAnimal toLostAnimal(JsonNode item) {
        String rfidCd = getText(item, "rfidCd");
        String happenDtRaw = getText(item, "happenDt");
        String happenAddr = getText(item, "happenAddr");
        String happenAddrDtl = getText(item, "happenAddrDtl");
        String happenPlace = getText(item, "happenPlace");
        String kindCd = getText(item, "kindCd");
        String colorCd = getText(item, "colorCd");
        String age = getText(item, "age");
        String sexCd = getText(item, "sexCd");
        String specialMark = getText(item, "specialMark");
        String popfile = getText(item, "popfile");
        String callName = getText(item, "callName");
        String callTel = getText(item, "callTel");
        String orgNm = getText(item, "orgNm");

        if (happenDtRaw == null && happenAddr == null && kindCd == null) {
            return null;
        }

        LocalDateTime happenDt = parseDateTime(happenDtRaw);

        return LostAnimal.builder()
            .rfidCd(rfidCd)
            .happenDt(happenDt)
            .happenAddr(happenAddr)
            .happenAddrDtl(happenAddrDtl)
            .happenPlace(happenPlace)
            .kindCd(kindCd)
            .colorCd(colorCd)
            .age(age)
            .sexCd(sexCd)
            .specialMark(specialMark)
            .popfile(popfile)
            .callName(callName)
            .callTel(callTel)
            .orgNm(orgNm)
            .cachedAt(LocalDateTime.now())
            .build();
    }

    private String getText(JsonNode node, String field) {
        if (node == null || field == null) {
            return null;
        }
        JsonNode value = node.get(field);
        if (value == null || value.isNull()) {
            return null;
        }
        String text = value.asText();
        return text == null || text.isBlank() ? null : text;
    }

    private java.math.BigDecimal getDecimal(JsonNode node, String field) {
        String value = getText(node, field);
        if (value == null) {
            return null;
        }
        try {
            return new java.math.BigDecimal(value);
        } catch (Exception ex) {
            return null;
        }
    }

    private Integer getInteger(JsonNode node, String field) {
        String value = getText(node, field);
        if (value == null) {
            return null;
        }
        try {
            return Integer.parseInt(value);
        } catch (Exception ex) {
            return null;
        }
    }

    private LocalDate parseDate(String value) {
        if (value == null) {
            return null;
        }
        try {
            if (value.contains("-")) {
                return LocalDate.parse(value);
            }
            return LocalDate.parse(value, DATE_FORMATTER);
        } catch (Exception ex) {
            logger.warn("날짜 파싱 실패: {}", value);
            return null;
        }
    }

    private LocalDateTime parseDateTime(String value) {
        if (value == null) {
            return null;
        }
        try {
            return LocalDateTime.parse(value, DATETIME_FORMATTER);
        } catch (Exception ex) {
            try {
                return LocalDateTime.parse(value, LOST_DATETIME_FORMATTER);
            } catch (Exception ignored) {
                return null;
            }
        }
    }

    private Integer parseNumber(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            String normalized = value.replaceAll("[^0-9.]", "").trim();
            if (normalized.isEmpty()) {
                return null;
            }
            if (normalized.contains(".")) {
                double parsed = Double.parseDouble(normalized);
                return (int) Math.round(parsed);
            }
            return Integer.parseInt(normalized);
        } catch (Exception ex) {
            return null;
        }
    }

    public static class SyncResult {

        private final int savedCount;
        private final int totalCount;

        public SyncResult(int savedCount, int totalCount) {
            this.savedCount = savedCount;
            this.totalCount = totalCount;
        }

        public int getSavedCount() {
            return savedCount;
        }

        public int getTotalCount() {
            return totalCount;
        }
    }
}
