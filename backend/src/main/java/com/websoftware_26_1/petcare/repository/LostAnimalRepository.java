package com.websoftware_26_1.petcare.repository;

import com.websoftware_26_1.petcare.domain.LostAnimal;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
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

    public List<LostAnimal> findAllWithKeyword(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return findAll();
        }
        String jpql = "select l from LostAnimal l where l.kindCd like :keyword or l.orgNm like :keyword or l.specialMark like :keyword or l.happenPlace like :keyword order by l.id desc";
        return entityManager.createQuery(jpql, LostAnimal.class)
            .setParameter("keyword", "%" + keyword + "%")
            .getResultList();
    }

    public int deleteAll() {
        String jpql = "delete from LostAnimal l";
        return entityManager.createQuery(jpql).executeUpdate();
    }
}
