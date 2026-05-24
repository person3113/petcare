package com.websoftware_26_1.petcare.service;

import com.websoftware_26_1.petcare.domain.Post;
import com.websoftware_26_1.petcare.domain.User;
import com.websoftware_26_1.petcare.repository.PostRepository;
import com.websoftware_26_1.petcare.repository.UserRepository;
import com.websoftware_26_1.petcare.web.dto.PostCreateRequest;
import com.websoftware_26_1.petcare.web.dto.PostResponse;
import com.websoftware_26_1.petcare.web.dto.PostUpdateRequest;
import com.websoftware_26_1.petcare.web.exception.AuthException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostService {

    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getPosts(String category) {
        List<Post> posts = category == null || category.isBlank()
            ? postRepository.findAll()
            : postRepository.findAllByCategory(category);

        List<PostResponse> responses = new ArrayList<>();
        for (Post post : posts) {
            responses.add(toResponse(post));
        }
        return responses;
    }

    @Transactional(readOnly = true)
    public PostResponse getPost(Long postId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        return toResponse(post);
    }

    @Transactional
    public PostResponse createPost(Long userId, PostCreateRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new AuthException("User not found.", HttpStatus.UNAUTHORIZED));

        validateCategory(request.getCategory());
        validatePost(request.getTitle(), request.getContent());

        Post post = Post.builder()
            .user(user)
            .title(request.getTitle())
            .content(request.getContent())
            .category(request.getCategory())
            .build();

        Post saved = postRepository.save(post);
        return toResponse(saved);
    }

    @Transactional
    public PostResponse updatePost(Long userId, Long postId, PostUpdateRequest request) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new AuthException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        validateCategory(request.getCategory());
        validatePost(request.getTitle(), request.getContent());

        post.update(request.getTitle(), request.getContent(), request.getCategory());
        return toResponse(post);
    }

    @Transactional
    public void deletePost(Long userId, Long postId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new AuthException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        postRepository.delete(post);
    }

    private PostResponse toResponse(Post post) {
        return PostResponse.builder()
            .id(post.getId())
            .title(post.getTitle())
            .content(post.getContent())
            .category(post.getCategory())
            .userId(post.getUser().getId())
            .userNickname(post.getUser().getNickname())
            .createdAt(formatDateTime(post.getCreatedAt()))
            .updatedAt(formatDateTime(post.getUpdatedAt()))
            .build();
    }

    private String formatDateTime(LocalDateTime value) {
        if (value == null) {
            return null;
        }
        return value.format(DATETIME_FORMATTER);
    }

    private void validateCategory(String category) {
        if (category == null || category.isBlank()) {
            throw new IllegalArgumentException("Category is required");
        }
        if (!"adoption_review".equals(category) && !"lost_sighting".equals(category)) {
            throw new IllegalArgumentException("Invalid category");
        }
    }

    private void validatePost(String title, String content) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Content is required");
        }
    }
}
