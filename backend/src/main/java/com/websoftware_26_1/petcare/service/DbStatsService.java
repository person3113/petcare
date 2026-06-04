package com.websoftware_26_1.petcare.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DbStatsService {

    @PersistenceContext
    private EntityManager em;

    public Map<String, Object> getGlobalStats() {
        Map<String, Object> result = new HashMap<>();
        result.put("rescueTrend", getRescueTrend());
        result.put("lostVsRescue", getLostVsRescueTrend());
        return result;
    }

    private com.websoftware_26_1.petcare.web.dto.StatsRealtimeResponse cachedRealtimeResponse;
    private LocalDate lastCachedDate;

    public com.websoftware_26_1.petcare.web.dto.StatsRealtimeResponse getRealtimeSummary() {
        LocalDate today = LocalDate.now();
        
        if (cachedRealtimeResponse != null && today.equals(lastCachedDate)) {
            return cachedRealtimeResponse;
        }

        LocalDate pastMonth = today.minusDays(30);

        String jpql = "SELECT a.processState, COUNT(a) FROM Animal a WHERE a.happenDt >= :pastMonth GROUP BY a.processState";
        List<Object[]> rows = em.createQuery(jpql, Object[].class)
            .setParameter("pastMonth", pastMonth)
            .getResultList();

        int totalRescued = 0;
        int totalAdopted = 0;
        int totalEuthanized = 0;
        int totalProtecting = 0;

        for (Object[] row : rows) {
            String state = (String) row[0];
            int count = ((Long) row[1]).intValue();
            totalRescued += count;
            if (state != null) {
                if (state.contains("입양")) totalAdopted += count;
                else if (state.contains("안락사")) totalEuthanized += count;
                else if (state.contains("보호")) totalProtecting += count;
            }
        }
        
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("yy.MM.dd");
        com.websoftware_26_1.petcare.web.dto.StatsRealtimeResponse response = new com.websoftware_26_1.petcare.web.dto.StatsRealtimeResponse(
            today.format(formatter), totalRescued, totalAdopted, totalEuthanized, totalProtecting
        );
        
        this.cachedRealtimeResponse = response;
        this.lastCachedDate = today;
        
        return response;
    }

    private java.util.concurrent.ConcurrentHashMap<String, Map<String, Object>> filteredStatsCache = new java.util.concurrent.ConcurrentHashMap<>();

    public Map<String, Object> getFilteredStats(String startDateStr, String endDateStr, String sido) {
        String cacheKey = String.format("%s_%s_%s", startDateStr, endDateStr, sido);
        if (filteredStatsCache.containsKey(cacheKey)) {
            return filteredStatsCache.get(cacheKey);
        }

        LocalDate start = (startDateStr != null && !startDateStr.isEmpty()) ? LocalDate.parse(startDateStr, DateTimeFormatter.ISO_DATE) : null;
        LocalDate end = (endDateStr != null && !endDateStr.isEmpty()) ? LocalDate.parse(endDateStr, DateTimeFormatter.ISO_DATE) : null;

        Map<String, Object> result = new HashMap<>();
        result.put("regionalStats", getRegionalStats(start, end, sido));
        result.put("statusRatio", getStatusRatio(start, end, sido));
        result.put("kindRatio", getKindRatio(start, end, sido));
        result.put("topBreeds", getTopBreeds(start, end, sido));
        result.put("lostHotspots", getLostHotspots(start, end, sido));
        result.put("topLostBreeds", getTopLostBreeds(start, end, sido));
        result.put("topShelters", getTopShelters(start, end, sido));
        
        filteredStatsCache.put(cacheKey, result);
        return result;
    }

    private String buildWhere(String alias, LocalDate start, LocalDate end, String sido, String extraCond) {
        List<String> conditions = new ArrayList<>();
        if (extraCond != null && !extraCond.isEmpty()) {
            conditions.add(extraCond);
        }
        if (sido != null && !sido.trim().isEmpty()) {
            conditions.add(alias + ".orgNm LIKE :sido");
        }
        if (start != null) {
            conditions.add(alias + ".happenDt >= :start");
        }
        if (end != null) {
            conditions.add(alias + ".happenDt <= :end");
        }
        return conditions.isEmpty() ? "" : " WHERE " + String.join(" AND ", conditions);
    }

    private void setParams(Query query, LocalDate start, LocalDate end, String sido) {
        if (sido != null && !sido.trim().isEmpty()) {
            query.setParameter("sido", sido + "%");
        }
        if (start != null) {
            query.setParameter("start", start);
        }
        if (end != null) {
            query.setParameter("end", end);
        }
    }

    private void setParamsLostAnimal(Query query, LocalDate start, LocalDate end, String sido) {
        if (sido != null && !sido.trim().isEmpty()) {
            query.setParameter("sido", sido + "%");
        }
        if (start != null) {
            query.setParameter("start", start.atStartOfDay());
        }
        if (end != null) {
            query.setParameter("end", end.atTime(23, 59, 59));
        }
    }

    private List<Map<String, Object>> getRescueTrend() {
        String jpql = "SELECT SUBSTRING(CAST(a.happenDt AS string), 1, 7) as month, COUNT(a) FROM Animal a WHERE a.happenDt IS NOT NULL GROUP BY SUBSTRING(CAST(a.happenDt AS string), 1, 7) ORDER BY month";
        List<Object[]> rows = em.createQuery(jpql, Object[].class).getResultList();
        return rows.stream().map(row -> Map.of("month", row[0], "count", row[1])).collect(Collectors.toList());
    }

    private List<Map<String, Object>> getLostVsRescueTrend() {
        List<Map<String, Object>> rescueTrend = getRescueTrend();
        
        String jpql = "SELECT SUBSTRING(CAST(l.happenDt AS string), 1, 7) as month, COUNT(l) FROM LostAnimal l WHERE l.happenDt IS NOT NULL GROUP BY SUBSTRING(CAST(l.happenDt AS string), 1, 7) ORDER BY month";
        List<Object[]> rows = em.createQuery(jpql, Object[].class).getResultList();
        Map<String, Long> lostMap = rows.stream().collect(Collectors.toMap(
            r -> (String) r[0],
            r -> (Long) r[1]
        ));
        
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> r : rescueTrend) {
            String month = (String) r.get("month");
            Map<String, Object> map = new HashMap<>();
            map.put("month", month);
            map.put("rescueCount", r.get("count"));
            map.put("lostCount", lostMap.getOrDefault(month, 0L));
            result.add(map);
        }
        return result;
    }

    private List<Map<String, Object>> getRegionalStats(LocalDate start, LocalDate end, String sido) {
        String whereClause = buildWhere("a", start, end, sido, "a.orgNm IS NOT NULL");
        String jpql = "SELECT a.orgNm, a.processState FROM Animal a" + whereClause;
        Query query = em.createQuery(jpql, Object[].class);
        setParams(query, start, end, sido);
        List<Object[]> rows = query.getResultList();
        
        Map<String, int[]> regionMap = new HashMap<>();
        boolean isSidoFiltered = (sido != null && !sido.trim().isEmpty());

        for (Object[] row : rows) {
            String orgNm = (String) row[0];
            String state = (String) row[1];
            // If sido is filtered, group by sigungu (2nd word). Else, group by sido (1st word).
            String[] parts = orgNm.split(" ");
            String regionKey;
            if (isSidoFiltered && parts.length > 1) {
                regionKey = parts[1]; // 시군구
            } else {
                regionKey = parts[0]; // 시도
            }
            
            regionMap.putIfAbsent(regionKey, new int[3]);
            int[] counts = regionMap.get(regionKey);
            counts[0]++;
            if (state != null) {
                if (state.contains("입양")) counts[1]++;
                if (state.contains("안락사")) counts[2]++;
            }
        }
        
        List<Map<String, Object>> list = new ArrayList<>();
        for (Map.Entry<String, int[]> entry : regionMap.entrySet()) {
            Map<String, Object> map = new HashMap<>();
            map.put("region", entry.getKey());
            map.put("total", entry.getValue()[0]);
            map.put("adopted", entry.getValue()[1]);
            map.put("euthanized", entry.getValue()[2]);
            map.put("adoptionRate", entry.getValue()[0] > 0 ? Math.round((double) entry.getValue()[1] / entry.getValue()[0] * 1000.0)/10.0 : 0);
            map.put("euthanasiaRate", entry.getValue()[0] > 0 ? Math.round((double) entry.getValue()[2] / entry.getValue()[0] * 1000.0)/10.0 : 0);
            list.add(map);
        }
        list.sort((a, b) -> Double.compare((Double)b.get("adoptionRate"), (Double)a.get("adoptionRate")));
        return list;
    }

    private List<Map<String, Object>> getStatusRatio(LocalDate start, LocalDate end, String sido) {
        String whereClause = buildWhere("a", start, end, sido, null);
        String jpql = "SELECT a.processState, COUNT(a) FROM Animal a" + whereClause + " GROUP BY a.processState";
        Query query = em.createQuery(jpql, Object[].class);
        setParams(query, start, end, sido);
        List<Object[]> rows = query.getResultList();
        return rows.stream().map(row -> Map.of("status", row[0] == null ? "알수없음" : row[0], "count", row[1])).collect(Collectors.toList());
    }

    private List<Map<String, Object>> getKindRatio(LocalDate start, LocalDate end, String sido) {
        String whereClause = buildWhere("a", start, end, sido, null);
        String jpql = "SELECT a.upKindNm, COUNT(a) FROM Animal a" + whereClause + " GROUP BY a.upKindNm";
        Query query = em.createQuery(jpql, Object[].class);
        setParams(query, start, end, sido);
        List<Object[]> rows = query.getResultList();
        
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            String upKindNm = (String) row[0];
            Long count = (Long) row[1];
            String kind = upKindNm == null ? "기타" : upKindNm;
            
            String subWhere = buildWhere("a", start, end, sido, "a.upKindNm = :upKindNm");
            String subJpql;
            if ("기타".equals(upKindNm)) {
                subJpql = "SELECT a.kindFullNm, COUNT(a) as cnt FROM Animal a" + subWhere + " GROUP BY a.kindFullNm ORDER BY cnt DESC";
            } else {
                subJpql = "SELECT a.kindNm, COUNT(a) as cnt FROM Animal a" + subWhere + " GROUP BY a.kindNm ORDER BY cnt DESC";
            }
            
            Query subQuery = em.createQuery(subJpql, Object[].class).setParameter("upKindNm", upKindNm).setMaxResults(5);
            setParams(subQuery, start, end, sido);
            List<Object[]> subRows = subQuery.getResultList();
                
            List<Map<String, Object>> top5 = subRows.stream()
                .map(r -> {
                    String breedName = r[0] != null ? (String) r[0] : "알수없음";
                    if ("기타".equals(upKindNm)) {
                        breedName = breedName.replace("[기타축종]", "").trim();
                    }
                    return Map.of("breed", breedName, "count", r[1]);
                })
                .collect(Collectors.toList());
            
            Map<String, Object> map = new HashMap<>();
            map.put("kind", kind);
            map.put("count", count);
            map.put("topBreeds", top5);
            result.add(map);
        }
        return result;
    }

    private List<Map<String, Object>> getTopBreeds(LocalDate start, LocalDate end, String sido) {
        String whereClause = buildWhere("a", start, end, sido, "a.kindNm IS NOT NULL");
        String jpql = "SELECT a.kindNm, COUNT(a) as cnt FROM Animal a" + whereClause + " GROUP BY a.kindNm ORDER BY cnt DESC";
        Query query = em.createQuery(jpql, Object[].class).setMaxResults(10);
        setParams(query, start, end, sido);
        List<Object[]> rows = query.getResultList();
        return rows.stream().map(row -> Map.of("breed", row[0], "count", row[1])).collect(Collectors.toList());
    }

    private List<Map<String, Object>> getLostHotspots(LocalDate start, LocalDate end, String sido) {
        String whereClause = buildWhere("l", start, end, sido, "l.orgNm IS NOT NULL");
        String jpql = "SELECT l.orgNm, COUNT(l) as cnt FROM LostAnimal l" + whereClause + " GROUP BY l.orgNm ORDER BY cnt DESC";
        Query query = em.createQuery(jpql, Object[].class).setMaxResults(10);
        setParamsLostAnimal(query, start, end, sido);
        List<Object[]> rows = query.getResultList();
        return rows.stream().map(row -> Map.of("region", row[0], "count", row[1])).collect(Collectors.toList());
    }

    private List<Map<String, Object>> getTopLostBreeds(LocalDate start, LocalDate end, String sido) {
        String whereClause = buildWhere("l", start, end, sido, "l.kindCd IS NOT NULL");
        String jpql = "SELECT l.kindCd, COUNT(l) as cnt FROM LostAnimal l" + whereClause + " GROUP BY l.kindCd ORDER BY cnt DESC";
        Query query = em.createQuery(jpql, Object[].class).setMaxResults(10);
        setParamsLostAnimal(query, start, end, sido);
        List<Object[]> rows = query.getResultList();
        
        return rows.stream().map(row -> {
            String breed = (String) row[0];
            breed = breed.replace("[개]", "").replace("[고양이]", "").replace("[기타축종]", "").trim();
            return Map.of("breed", breed, "count", row[1]);
        }).collect(Collectors.toList());
    }

    private List<Map<String, Object>> getTopShelters(LocalDate start, LocalDate end, String sido) {
        String whereClause = buildWhere("a", start, end, sido, "a.careNm IS NOT NULL");
        String jpql = "SELECT a.careNm, COUNT(a) as cnt FROM Animal a" + whereClause + " GROUP BY a.careNm ORDER BY cnt DESC";
        Query query = em.createQuery(jpql, Object[].class).setMaxResults(10);
        setParams(query, start, end, sido);
        List<Object[]> rows = query.getResultList();
        return rows.stream().map(row -> Map.of("shelter", row[0], "count", row[1])).collect(Collectors.toList());
    }
}
