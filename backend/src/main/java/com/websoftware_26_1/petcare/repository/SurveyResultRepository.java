package com.websoftware_26_1.petcare.repository;

import com.websoftware_26_1.petcare.domain.SurveyResult;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class SurveyResultRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public SurveyResult save(SurveyResult surveyResult) {
        if (surveyResult.getId() == null) {
            entityManager.persist(surveyResult);
            return surveyResult;
        }
        return entityManager.merge(surveyResult);
    }

    public Optional<SurveyResult> findByUserId(Long userId) {
        String jpql = "select s from SurveyResult s where s.user.id = :userId";
        return entityManager.createQuery(jpql, SurveyResult.class)
            .setParameter("userId", userId)
            .getResultStream()
            .findFirst();
    }
}
