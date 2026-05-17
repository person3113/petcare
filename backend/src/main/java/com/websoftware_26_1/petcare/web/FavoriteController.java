package com.websoftware_26_1.petcare.web;

import com.websoftware_26_1.petcare.service.FavoriteService;
import com.websoftware_26_1.petcare.web.dto.ApiResponse;
import com.websoftware_26_1.petcare.web.dto.FavoriteResponse;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/likes")
public class FavoriteController {

    private static final String LOGIN_USER = "LOGIN_USER";

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getFavorites(HttpSession session) {
        Long userId = getLoginUserId(session);
        List<FavoriteResponse> responses = favoriteService.getFavorites(userId);
        return ResponseEntity.ok(ApiResponse.ok(responses));
    }

    @PostMapping("/{desertionNo}")
    public ResponseEntity<ApiResponse<FavoriteResponse>> addFavorite(
        @PathVariable String desertionNo,
        HttpSession session
    ) {
        Long userId = getLoginUserId(session);
        FavoriteResponse response = favoriteService.addFavorite(userId, desertionNo);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }

    @DeleteMapping("/{desertionNo}")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
        @PathVariable String desertionNo,
        HttpSession session
    ) {
        Long userId = getLoginUserId(session);
        favoriteService.removeFavorite(userId, desertionNo);
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
