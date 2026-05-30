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

    public List<LostAnimal> findAll() {
        String jpql = "select l from LostAnimal l order by l.id desc";
        return entityManager.createQuery(jpql, LostAnimal.class).getResultList();
    }

    public int deleteAll() {
        String jpql = "delete from LostAnimal l";
        return entityManager.createQuery(jpql).executeUpdate();
    }
}
