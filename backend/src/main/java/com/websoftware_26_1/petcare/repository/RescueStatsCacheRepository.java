package com.websoftware_26_1.petcare.repository;

import com.websoftware_26_1.petcare.domain.RescueStatsCache;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public class RescueStatsCacheRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public RescueStatsCache save(RescueStatsCache stats) {
        if (stats.getId() == null) {
            entityManager.persist(stats);
            return stats;
        }
        return entityManager.merge(stats);
    }

    public List<RescueStatsCache> findByPeriod(LocalDate bgnde, LocalDate endde) {
        String jpql = "select r from RescueStatsCache r where r.bgnde = :bgnde and r.endde = :endde";
        return entityManager.createQuery(jpql, RescueStatsCache.class)
            .setParameter("bgnde", bgnde)
            .setParameter("endde", endde)
            .getResultList();
    }

    public void deleteByPeriod(LocalDate bgnde, LocalDate endde) {
        String jpql = "delete from RescueStatsCache r where r.bgnde = :bgnde and r.endde = :endde";
        entityManager.createQuery(jpql)
            .setParameter("bgnde", bgnde)
            .setParameter("endde", endde)
            .executeUpdate();
    }
}
