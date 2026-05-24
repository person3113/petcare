package com.websoftware_26_1.petcare.web;

import com.websoftware_26_1.petcare.service.CommentService;
import com.websoftware_26_1.petcare.web.dto.ApiResponse;
import com.websoftware_26_1.petcare.web.dto.CommentCreateRequest;
import com.websoftware_26_1.petcare.web.dto.CommentResponse;
import com.websoftware_26_1.petcare.web.dto.CommentUpdateRequest;
import com.websoftware_26_1.petcare.web.dto.UserResponse;
import com.websoftware_26_1.petcare.web.exception.AuthException;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CommentController {

    private static final String LOGIN_USER = "LOGIN_USER";

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(@PathVariable Long postId) {
        List<CommentResponse> responses = commentService.getComments(postId);
        return ResponseEntity.ok(ApiResponse.ok(responses));
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
        @PathVariable Long postId,
        @RequestBody CommentCreateRequest request,
        HttpSession session
    ) {
        Long userId = getLoginUserId(session);
        CommentResponse response = commentService.createComment(userId, postId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(
        @PathVariable Long commentId,
        @RequestBody CommentUpdateRequest request,
        HttpSession session
    ) {
        Long userId = getLoginUserId(session);
        CommentResponse response = commentService.updateComment(userId, commentId, request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
        @PathVariable Long commentId,
        HttpSession session
    ) {
        Long userId = getLoginUserId(session);
        commentService.deleteComment(userId, commentId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    private Long getLoginUserId(HttpSession session) {
        if (session == null) {
            throw new AuthException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        Object loginUser = session.getAttribute(LOGIN_USER);
        if (loginUser instanceof UserResponse) {
            return ((UserResponse) loginUser).getId();
        }
        throw new AuthException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
}
