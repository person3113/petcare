package com.websoftware_26_1.petcare.repository;

import com.websoftware_26_1.petcare.domain.Post;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class PostRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public Post save(Post post) {
        if (post.getId() == null) {
            entityManager.persist(post);
            return post;
        }
        return entityManager.merge(post);
    }

    public Optional<Post> findById(Long id) {
        return Optional.ofNullable(entityManager.find(Post.class, id));
    }

    public List<Post> findAllByCategory(String category) {
        String jpql = "select p from Post p where p.category = :category order by p.createdAt desc";
        return entityManager.createQuery(jpql, Post.class)
            .setParameter("category", category)
            .getResultList();
    }

    public List<Post> findAll() {
        String jpql = "select p from Post p order by p.createdAt desc";
        return entityManager.createQuery(jpql, Post.class).getResultList();
    }

    public List<Post> findAllWithFilters(String category, String keyword) {
        StringBuilder jpql = new StringBuilder("select p from Post p where 1=1");
        java.util.Map<String, Object> params = new java.util.HashMap<>();

        if (category != null && !category.isBlank()) {
            jpql.append(" and p.category = :category");
            params.put("category", category);
        }
        if (keyword != null && !keyword.isBlank()) {
            jpql.append(" and (p.title like :keyword or p.content like :keyword)");
            params.put("keyword", "%" + keyword + "%");
        }

        jpql.append(" order by p.createdAt desc");
        
        jakarta.persistence.TypedQuery<Post> query = entityManager.createQuery(jpql.toString(), Post.class);
        for (java.util.Map.Entry<String, Object> entry : params.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }
        return query.getResultList();
    }

    public void delete(Post post) {
        entityManager.remove(post);
    }
}
