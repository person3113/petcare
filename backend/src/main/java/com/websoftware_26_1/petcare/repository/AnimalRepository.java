package com.websoftware_26_1.petcare.repository;

import com.websoftware_26_1.petcare.domain.Animal;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class AnimalRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public Animal save(Animal animal) {
        if (animal.getDesertionNo() == null) {
            entityManager.persist(animal);
            return animal;
        }
        return entityManager.merge(animal);
    }

    public Optional<Animal> findById(String desertionNo) {
        return Optional.ofNullable(entityManager.find(Animal.class, desertionNo));
    }

    public List<Animal> findByCareRegNo(String careRegNo) {
        String jpql = "select a from Animal a where a.careRegNo = :careRegNo";
        return entityManager.createQuery(jpql, Animal.class)
            .setParameter("careRegNo", careRegNo)
            .getResultList();
    }

    public List<Animal> findAllWithFilters(
        String sido,
        String sigungu,
        String shelterName,
        String kind,
        String processState,
        String gender,
        String isNeutered,
        Boolean onlySocialized,
        Boolean onlyHealthy,
        String keyword,
        int offset,
        int limit
    ) {
        StringBuilder jpql = new StringBuilder("select a from Animal a where 1=1");
        Map<String, Object> params = new HashMap<>();

        if (sido != null && !sido.isBlank()) {
            jpql.append(" and a.orgNm like :sido");
            params.put("sido", "%" + sido + "%");
        }
        if (sigungu != null && !sigungu.isBlank()) {
            jpql.append(" and a.orgNm like :sigungu");
            params.put("sigungu", "%" + sigungu + "%");
        }
        if (shelterName != null && !shelterName.isBlank()) {
            jpql.append(" and a.careNm = :shelterName");
            params.put("shelterName", shelterName);
        }
        if (kind != null && !kind.isBlank()) {
            jpql.append(" and (a.kindCd like :kind or a.kindNm like :kind or a.kindFullNm like :kind)");
            params.put("kind", "%" + kind + "%");
        }
        if (processState != null && !processState.isBlank()) {
            jpql.append(" and a.processState = :processState");
            params.put("processState", processState);
        }
        if (gender != null && !gender.isBlank()) {
            if ("수컷".equals(gender)) {
                jpql.append(" and a.sexCd = 'M'");
            } else if ("암컷".equals(gender)) {
                jpql.append(" and a.sexCd = 'F'");
            }
        }
        if (isNeutered != null && !isNeutered.isBlank()) {
            if ("예".equals(isNeutered)) {
                jpql.append(" and a.neuterYn = 'Y'");
            } else if ("아니오".equals(isNeutered)) {
                jpql.append(" and a.neuterYn = 'N'");
            } else if ("미상".equals(isNeutered)) {
                jpql.append(" and a.neuterYn = 'U'");
            }
        }
        if (Boolean.TRUE.equals(onlySocialized)) {
            jpql.append(" and a.sfeSoci is not null and trim(a.sfeSoci) != ''");
        }
        if (Boolean.TRUE.equals(onlyHealthy)) {
            jpql.append(" and (a.sfeHealth = '양호' or (a.sfeHealth is null and a.healthChk = '양호'))");
        }
        if (keyword != null && !keyword.isBlank()) {
            jpql.append(" and (a.kindCd like :keyword or a.careNm like :keyword or a.specialMark like :keyword or a.kindNm like :keyword)");
            params.put("keyword", "%" + keyword + "%");
        }

        jpql.append(" order by a.noticeEdt asc");

        TypedQuery<Animal> query = entityManager.createQuery(jpql.toString(), Animal.class);
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }

        return query
            .setFirstResult(offset)
            .setMaxResults(limit)
            .getResultList();
    }

    public List<Animal> findAllWithFiltersForMatch(
        String upKindCd,
        String orgNm,
        String careRegNo,
        String processState,
        String sexCd,
        String neuterYn,
        int offset,
        int limit
    ) {
        StringBuilder jpql = new StringBuilder("select a from Animal a where 1=1");
        Map<String, Object> params = new HashMap<>();

        if (upKindCd != null && !upKindCd.isBlank()) {
            jpql.append(" and a.upKindCd = :upKindCd");
            params.put("upKindCd", upKindCd);
        }
        if (orgNm != null && !orgNm.isBlank()) {
            jpql.append(" and a.orgNm like :orgNm");
            params.put("orgNm", "%" + orgNm + "%");
        }
        if (careRegNo != null && !careRegNo.isBlank()) {
            jpql.append(" and a.careRegNo = :careRegNo");
            params.put("careRegNo", careRegNo);
        }
        if (processState != null && !processState.isBlank()) {
            jpql.append(" and a.processState = :processState");
            params.put("processState", processState);
        }
        if (sexCd != null && !sexCd.isBlank()) {
            jpql.append(" and a.sexCd = :sexCd");
            params.put("sexCd", sexCd);
        }
        if (neuterYn != null && !neuterYn.isBlank()) {
            jpql.append(" and a.neuterYn = :neuterYn");
            params.put("neuterYn", neuterYn);
        }

        jpql.append(" order by a.noticeEdt asc");

        TypedQuery<Animal> query = entityManager.createQuery(jpql.toString(), Animal.class);
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }

        return query
            .setFirstResult(offset)
            .setMaxResults(limit)
            .getResultList();
    }

    public int countAllWithFiltersForMatch(
        String upKindCd,
        String orgNm,
        String careRegNo,
        String processState,
        String sexCd,
        String neuterYn
    ) {
        StringBuilder jpql = new StringBuilder("select count(a) from Animal a where 1=1");
        Map<String, Object> params = new HashMap<>();

        if (upKindCd != null && !upKindCd.isBlank()) {
            jpql.append(" and a.upKindCd = :upKindCd");
            params.put("upKindCd", upKindCd);
        }
        if (orgNm != null && !orgNm.isBlank()) {
            jpql.append(" and a.orgNm like :orgNm");
            params.put("orgNm", "%" + orgNm + "%");
        }
        if (careRegNo != null && !careRegNo.isBlank()) {
            jpql.append(" and a.careRegNo = :careRegNo");
            params.put("careRegNo", careRegNo);
        }
        if (processState != null && !processState.isBlank()) {
            jpql.append(" and a.processState = :processState");
            params.put("processState", processState);
        }
        if (sexCd != null && !sexCd.isBlank()) {
            jpql.append(" and a.sexCd = :sexCd");
            params.put("sexCd", sexCd);
        }
        if (neuterYn != null && !neuterYn.isBlank()) {
            jpql.append(" and a.neuterYn = :neuterYn");
            params.put("neuterYn", neuterYn);
        }

        TypedQuery<Long> query = entityManager.createQuery(jpql.toString(), Long.class);
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }
        Long count = query.getSingleResult();
        return count == null ? 0 : count.intValue();
    }

    public int countAllWithFilters(
        String sido,
        String sigungu,
        String shelterName,
        String kind,
        String processState,
        String gender,
        String isNeutered,
        Boolean onlySocialized,
        Boolean onlyHealthy,
        String keyword
    ) {
        StringBuilder jpql = new StringBuilder("select count(a) from Animal a where 1=1");
        Map<String, Object> params = new HashMap<>();

        if (sido != null && !sido.isBlank()) {
            jpql.append(" and a.orgNm like :sido");
            params.put("sido", "%" + sido + "%");
        }
        if (sigungu != null && !sigungu.isBlank()) {
            jpql.append(" and a.orgNm like :sigungu");
            params.put("sigungu", "%" + sigungu + "%");
        }
        if (shelterName != null && !shelterName.isBlank()) {
            jpql.append(" and a.careNm = :shelterName");
            params.put("shelterName", shelterName);
        }
        if (kind != null && !kind.isBlank()) {
            jpql.append(" and (a.kindCd like :kind or a.kindNm like :kind or a.kindFullNm like :kind)");
            params.put("kind", "%" + kind + "%");
        }
        if (processState != null && !processState.isBlank()) {
            jpql.append(" and a.processState = :processState");
            params.put("processState", processState);
        }
        if (gender != null && !gender.isBlank()) {
            if ("수컷".equals(gender)) {
                jpql.append(" and a.sexCd = 'M'");
            } else if ("암컷".equals(gender)) {
                jpql.append(" and a.sexCd = 'F'");
            }
        }
        if (isNeutered != null && !isNeutered.isBlank()) {
            if ("예".equals(isNeutered)) {
                jpql.append(" and a.neuterYn = 'Y'");
            } else if ("아니오".equals(isNeutered)) {
                jpql.append(" and a.neuterYn = 'N'");
            } else if ("미상".equals(isNeutered)) {
                jpql.append(" and a.neuterYn = 'U'");
            }
        }
        if (Boolean.TRUE.equals(onlySocialized)) {
            jpql.append(" and a.sfeSoci is not null and trim(a.sfeSoci) != ''");
        }
        if (Boolean.TRUE.equals(onlyHealthy)) {
            jpql.append(" and (a.sfeHealth = '양호' or (a.sfeHealth is null and a.healthChk = '양호'))");
        }
        if (keyword != null && !keyword.isBlank()) {
            jpql.append(" and (a.kindCd like :keyword or a.careNm like :keyword or a.specialMark like :keyword or a.kindNm like :keyword)");
            params.put("keyword", "%" + keyword + "%");
        }

        TypedQuery<Long> query = entityManager.createQuery(jpql.toString(), Long.class);
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }
        Long count = query.getSingleResult();
        return count == null ? 0 : count.intValue();
    }
}
