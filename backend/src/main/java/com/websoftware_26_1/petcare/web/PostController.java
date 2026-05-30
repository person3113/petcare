package com.websoftware_26_1.petcare.web;

import com.websoftware_26_1.petcare.service.PostService;
import com.websoftware_26_1.petcare.web.dto.ApiResponse;
import com.websoftware_26_1.petcare.web.dto.PostCreateRequest;
import com.websoftware_26_1.petcare.web.dto.PostResponse;
import com.websoftware_26_1.petcare.web.dto.PostUpdateRequest;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private static final String LOGIN_USER = "LOGIN_USER";

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PostResponse>>> getPosts(
        @RequestParam(name = "category", required = false) String category,
        @RequestParam(name = "keyword", required = false) String keyword
    ) {
        List<PostResponse> responses = postService.getPosts(category, keyword);
        return ResponseEntity.ok(ApiResponse.ok(responses));
    }

    @GetMapping("/{postId}")
    public ResponseEntity<ApiResponse<PostResponse>> getPost(@PathVariable Long postId) {
        PostResponse response = postService.getPost(postId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PostResponse>> createPost(
        @RequestBody PostCreateRequest request,
        HttpSession session
    ) {
        Long userId = getLoginUserId(session);
        PostResponse response = postService.createPost(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }

    @PutMapping("/{postId}")
    public ResponseEntity<ApiResponse<PostResponse>> updatePost(
        @PathVariable Long postId,
        @RequestBody PostUpdateRequest request,
        HttpSession session
    ) {
        Long userId = getLoginUserId(session);
        PostResponse response = postService.updatePost(userId, postId, request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<ApiResponse<Void>> deletePost(
        @PathVariable Long postId,
        HttpSession session
    ) {
        Long userId = getLoginUserId(session);
        postService.deletePost(userId, postId);
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
