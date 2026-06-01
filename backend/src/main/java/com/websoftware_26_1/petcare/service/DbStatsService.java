package com.websoftware_26_1.petcare.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DbStatsService {

    @PersistenceContext
    private EntityManager em;

    public Map<String, Object> getAllStats() {
        Map<String, Object> result = new HashMap<>();
        
        result.put("rescueTrend", getRescueTrend());
        result.put("regionalStats", getRegionalStats());
        result.put("statusRatio", getStatusRatio());
        result.put("kindRatio", getKindRatio());
        result.put("topBreeds", getTopBreeds());
        result.put("lostVsRescue", getLostVsRescueTrend());
        result.put("lostHotspots", getLostHotspots());
        result.put("topLostBreeds", getTopLostBreeds());

        return result;
    }

    private List<Map<String, Object>> getRescueTrend() {
        String jpql = "SELECT SUBSTRING(CAST(a.happenDt AS string), 1, 7) as month, COUNT(a) FROM Animal a WHERE a.happenDt IS NOT NULL GROUP BY SUBSTRING(CAST(a.happenDt AS string), 1, 7) ORDER BY month";
        List<Object[]> rows = em.createQuery(jpql, Object[].class).getResultList();
        return rows.stream().map(row -> Map.of("month", row[0], "count", row[1])).collect(Collectors.toList());
    }

    private List<Map<String, Object>> getRegionalStats() {
        String jpql = "SELECT a.orgNm, a.processState FROM Animal a WHERE a.orgNm IS NOT NULL";
        List<Object[]> rows = em.createQuery(jpql, Object[].class).getResultList();
        
        Map<String, int[]> regionMap = new HashMap<>();
        for (Object[] row : rows) {
            String orgNm = (String) row[0];
            String state = (String) row[1];
            String sido = orgNm.split(" ")[0]; 
            
            regionMap.putIfAbsent(sido, new int[3]);
            int[] counts = regionMap.get(sido);
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

    private List<Map<String, Object>> getStatusRatio() {
        String jpql = "SELECT a.processState, COUNT(a) FROM Animal a GROUP BY a.processState";
        List<Object[]> rows = em.createQuery(jpql, Object[].class).getResultList();
        return rows.stream().map(row -> Map.of("status", row[0] == null ? "알수없음" : row[0], "count", row[1])).collect(Collectors.toList());
    }

    private List<Map<String, Object>> getKindRatio() {
        String jpql = "SELECT a.upKindNm, COUNT(a) FROM Animal a GROUP BY a.upKindNm";
        List<Object[]> rows = em.createQuery(jpql, Object[].class).getResultList();
        
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            String upKindNm = (String) row[0];
            Long count = (Long) row[1];
            String kind = upKindNm == null ? "기타" : upKindNm;
            
            String subJpql;
            if ("기타".equals(upKindNm)) {
                subJpql = "SELECT a.kindFullNm, COUNT(a) as cnt FROM Animal a WHERE a.upKindNm = :upKindNm GROUP BY a.kindFullNm ORDER BY cnt DESC";
            } else {
                subJpql = "SELECT a.kindNm, COUNT(a) as cnt FROM Animal a WHERE a.upKindNm = :upKindNm GROUP BY a.kindNm ORDER BY cnt DESC";
            }
            
            List<Object[]> subRows = em.createQuery(subJpql, Object[].class)
                .setParameter("upKindNm", upKindNm)
                .setMaxResults(5)
                .getResultList();
                
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

    private List<Map<String, Object>> getTopBreeds() {
        String jpql = "SELECT a.kindNm, COUNT(a) as cnt FROM Animal a WHERE a.kindNm IS NOT NULL GROUP BY a.kindNm ORDER BY cnt DESC";
        List<Object[]> rows = em.createQuery(jpql, Object[].class).setMaxResults(10).getResultList();
        return rows.stream().map(row -> Map.of("breed", row[0], "count", row[1])).collect(Collectors.toList());
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

    private List<Map<String, Object>> getLostHotspots() {
        String jpql = "SELECT l.orgNm, COUNT(l) as cnt FROM LostAnimal l WHERE l.orgNm IS NOT NULL GROUP BY l.orgNm ORDER BY cnt DESC";
        List<Object[]> rows = em.createQuery(jpql, Object[].class).setMaxResults(10).getResultList();
        return rows.stream().map(row -> Map.of("region", row[0], "count", row[1])).collect(Collectors.toList());
    }

    private List<Map<String, Object>> getTopLostBreeds() {
        String jpql = "SELECT l.kindCd, COUNT(l) as cnt FROM LostAnimal l WHERE l.kindCd IS NOT NULL GROUP BY l.kindCd ORDER BY cnt DESC";
        List<Object[]> rows = em.createQuery(jpql, Object[].class).setMaxResults(10).getResultList();
        return rows.stream().map(row -> Map.of("breed", row[0], "count", row[1])).collect(Collectors.toList());
    }
}
