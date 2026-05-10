package com.websoftware_26_1.petcare.repository;

import com.websoftware_26_1.petcare.domain.Favorite;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class FavoriteRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public Favorite save(Favorite favorite) {
        if (favorite.getId() == null) {
            entityManager.persist(favorite);
            return favorite;
        }
        return entityManager.merge(favorite);
    }

    public Optional<Favorite> findById(Long id) {
        return Optional.ofNullable(entityManager.find(Favorite.class, id));
    }

    public List<Favorite> findByUserId(Long userId) {
        String jpql = "select f from Favorite f where f.user.id = :userId";
        return entityManager.createQuery(jpql, Favorite.class)
            .setParameter("userId", userId)
            .getResultList();
    }
}
