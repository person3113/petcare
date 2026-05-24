package com.websoftware_26_1.petcare.repository;

import com.websoftware_26_1.petcare.domain.Comment;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class CommentRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public Comment save(Comment comment) {
        if (comment.getId() == null) {
            entityManager.persist(comment);
            return comment;
        }
        return entityManager.merge(comment);
    }

    public Optional<Comment> findById(Long id) {
        return Optional.ofNullable(entityManager.find(Comment.class, id));
    }

    public List<Comment> findByPostId(Long postId) {
        String jpql = "select c from Comment c where c.post.id = :postId order by c.createdAt asc";
        return entityManager.createQuery(jpql, Comment.class)
            .setParameter("postId", postId)
            .getResultList();
    }

    public void delete(Comment comment) {
        entityManager.remove(comment);
    }
}
