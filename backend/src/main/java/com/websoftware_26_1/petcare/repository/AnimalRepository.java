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
        String upKindCd,
        String orgNm,
        String careRegNo,
        String processState,
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

    public int countAllWithFilters(
        String upKindCd,
        String orgNm,
        String careRegNo,
        String processState
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

        TypedQuery<Long> query = entityManager.createQuery(jpql.toString(), Long.class);
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }
        Long count = query.getSingleResult();
        return count == null ? 0 : count.intValue();
    }
}
