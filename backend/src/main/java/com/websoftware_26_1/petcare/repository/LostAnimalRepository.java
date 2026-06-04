package com.websoftware_26_1.petcare.repository;

import com.websoftware_26_1.petcare.domain.LostAnimal;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class LostAnimalRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public LostAnimal save(LostAnimal lostAnimal) {
        if (lostAnimal.getId() == null) {
            entityManager.persist(lostAnimal);
            return lostAnimal;
        }
        return entityManager.merge(lostAnimal);
    }

    public Optional<LostAnimal> findById(Long id) {
        return Optional.ofNullable(entityManager.find(LostAnimal.class, id));
    }

    public Optional<LostAnimal> findExisting(LostAnimal parsed) {
        if (parsed.getRfidCd() != null && !parsed.getRfidCd().isBlank()) {
            String jpql = "select l from LostAnimal l where l.rfidCd = :rfidCd";
            List<LostAnimal> res = entityManager.createQuery(jpql, LostAnimal.class)
                .setParameter("rfidCd", parsed.getRfidCd()).getResultList();
            if (!res.isEmpty()) return Optional.of(res.get(0));
        }
        if (parsed.getHappenDt() != null && parsed.getKindCd() != null) {
            String jpql = "select l from LostAnimal l where l.happenDt = :happenDt and l.kindCd = :kindCd";
            List<LostAnimal> res = entityManager.createQuery(jpql, LostAnimal.class)
                .setParameter("happenDt", parsed.getHappenDt())
                .setParameter("kindCd", parsed.getKindCd())
                .getResultList();
            if (!res.isEmpty()) return Optional.of(res.get(0));
        }
        return Optional.empty();
    }

    public List<LostAnimal> findAll() {
        String jpql = "select l from LostAnimal l order by l.id desc";
        return entityManager.createQuery(jpql, LostAnimal.class).getResultList();
    }

    public List<LostAnimal> findAllWithFilters(
        String sido,
        String sigungu,
        String kind,
        String gender,
        String keyword,
        int offset,
        int limit
    ) {
        StringBuilder jpql = new StringBuilder("select l from LostAnimal l where 1=1");
        Map<String, Object> params = new HashMap<>();

        if (sido != null && !sido.isBlank()) {
            jpql.append(" and l.orgNm like :sido");
            params.put("sido", "%" + sido + "%");
        }
        if (sigungu != null && !sigungu.isBlank()) {
            jpql.append(" and l.orgNm like :sigungu");
            params.put("sigungu", "%" + sigungu + "%");
        }
        if (kind != null && !kind.isBlank()) {
            jpql.append(" and l.kindCd like :kind");
            params.put("kind", "%" + kind + "%");
        }
        if (gender != null && !gender.isBlank()) {
            if ("수컷".equals(gender)) {
                jpql.append(" and l.sexCd = 'M'");
            } else if ("암컷".equals(gender)) {
                jpql.append(" and l.sexCd = 'F'");
            }
        }
        if (keyword != null && !keyword.isBlank()) {
            jpql.append(" and (l.kindCd like :keyword or l.orgNm like :keyword or l.specialMark like :keyword or l.happenPlace like :keyword)");
            params.put("keyword", "%" + keyword + "%");
        }

        jpql.append(" order by l.id desc");

        var query = entityManager.createQuery(jpql.toString(), LostAnimal.class);
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }

        return query
            .setFirstResult(offset)
            .setMaxResults(limit)
            .getResultList();
    }

    public int countAllWithFilters(
        String sido,
        String sigungu,
        String kind,
        String gender,
        String keyword
    ) {
        StringBuilder jpql = new StringBuilder("select count(l) from LostAnimal l where 1=1");
        Map<String, Object> params = new HashMap<>();

        if (sido != null && !sido.isBlank()) {
            jpql.append(" and l.orgNm like :sido");
            params.put("sido", "%" + sido + "%");
        }
        if (sigungu != null && !sigungu.isBlank()) {
            jpql.append(" and l.orgNm like :sigungu");
            params.put("sigungu", "%" + sigungu + "%");
        }
        if (kind != null && !kind.isBlank()) {
            jpql.append(" and l.kindCd like :kind");
            params.put("kind", "%" + kind + "%");
        }
        if (gender != null && !gender.isBlank()) {
            if ("수컷".equals(gender)) {
                jpql.append(" and l.sexCd = 'M'");
            } else if ("암컷".equals(gender)) {
                jpql.append(" and l.sexCd = 'F'");
            }
        }
        if (keyword != null && !keyword.isBlank()) {
            jpql.append(" and (l.kindCd like :keyword or l.orgNm like :keyword or l.specialMark like :keyword or l.happenPlace like :keyword)");
            params.put("keyword", "%" + keyword + "%");
        }

        var query = entityManager.createQuery(jpql.toString(), Long.class);
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }
        Long count = query.getSingleResult();
        return count == null ? 0 : count.intValue();
    }

    public int deleteAll() {
        String jpql = "delete from LostAnimal l";
        return entityManager.createQuery(jpql).executeUpdate();
    }
}
