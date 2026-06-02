package com.websoftware_26_1.petcare.repository;

import com.websoftware_26_1.petcare.domain.Shelter;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class ShelterRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public Shelter save(Shelter shelter) {
        if (shelter.getCareRegNo() == null) {
            entityManager.persist(shelter);
            return shelter;
        }
        return entityManager.merge(shelter);
    }

    public Optional<Shelter> findById(String careRegNo) {
        return Optional.ofNullable(entityManager.find(Shelter.class, careRegNo));
    }

    public List<Shelter> findAll() {
        String jpql = "select s from Shelter s";
        return entityManager.createQuery(jpql, Shelter.class).getResultList();
    }

    public List<Shelter> findByOrgNmStartingWith(String prefix) {
        String jpql = "select s from Shelter s where s.orgNm like :prefix";
        return entityManager.createQuery(jpql, Shelter.class)
            .setParameter("prefix", prefix + "%")
            .getResultList();
    }
}
