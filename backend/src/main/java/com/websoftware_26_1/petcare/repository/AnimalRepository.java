package com.websoftware_26_1.petcare.repository;

import com.websoftware_26_1.petcare.domain.Animal;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
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
}
