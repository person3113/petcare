package com.websoftware_26_1.petcare.service;

import com.websoftware_26_1.petcare.domain.Comment;
import com.websoftware_26_1.petcare.domain.Post;
import com.websoftware_26_1.petcare.domain.User;
import com.websoftware_26_1.petcare.repository.CommentRepository;
import com.websoftware_26_1.petcare.repository.PostRepository;
import com.websoftware_26_1.petcare.repository.UserRepository;
import com.websoftware_26_1.petcare.web.dto.CommentCreateRequest;
import com.websoftware_26_1.petcare.web.dto.CommentResponse;
import com.websoftware_26_1.petcare.web.dto.CommentUpdateRequest;
import com.websoftware_26_1.petcare.web.exception.AuthException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommentService {

    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentService(
        CommentRepository commentRepository,
        PostRepository postRepository,
        UserRepository userRepository
    ) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        List<CommentResponse> responses = new ArrayList<>();
        for (Comment comment : comments) {
            responses.add(toResponse(comment));
        }
        return responses;
    }

    @Transactional
    public CommentResponse createComment(Long userId, Long postId, CommentCreateRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new AuthException("User not found.", HttpStatus.UNAUTHORIZED));

        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        validateContent(request.getContent());

        Comment comment = Comment.builder()
            .user(user)
            .post(post)
            .content(request.getContent())
            .build();

        Comment saved = commentRepository.save(comment);
        return toResponse(saved);
    }

    @Transactional
    public CommentResponse updateComment(Long userId, Long commentId, CommentUpdateRequest request) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new IllegalArgumentException("Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new AuthException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        validateContent(request.getContent());

        comment.update(request.getContent());
        return toResponse(comment);
    }

    @Transactional
    public void deleteComment(Long userId, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new IllegalArgumentException("Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new AuthException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        commentRepository.delete(comment);
    }

    private CommentResponse toResponse(Comment comment) {
        return CommentResponse.builder()
            .id(comment.getId())
            .postId(comment.getPost().getId())
            .userId(comment.getUser().getId())
            .userNickname(comment.getUser().getNickname())
            .content(comment.getContent())
            .createdAt(formatDateTime(comment.getCreatedAt()))
            .updatedAt(formatDateTime(comment.getUpdatedAt()))
            .build();
    }

    private String formatDateTime(LocalDateTime value) {
        if (value == null) {
            return null;
        }
        return value.format(DATETIME_FORMATTER);
    }

    private void validateContent(String content) {
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Content is required");
        }
    }
}
