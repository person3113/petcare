package com.websoftware_26_1.petcare.repository;

import com.websoftware_26_1.petcare.domain.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public User save(User user) {
        if (user.getId() == null) {
            entityManager.persist(user);
            return user;
        }
        return entityManager.merge(user);
    }

    public Optional<User> findById(Long id) {
        return Optional.ofNullable(entityManager.find(User.class, id));
    }

    public Optional<User> findByEmail(String email) {
        String jpql = "select u from User u where u.email = :email";
        return entityManager.createQuery(jpql, User.class)
            .setParameter("email", email)
            .getResultStream()
            .findFirst();
    }
}
