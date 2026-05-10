package com.websoftware_26_1.petcare.service;

import com.websoftware_26_1.petcare.domain.User;
import com.websoftware_26_1.petcare.repository.UserRepository;
import com.websoftware_26_1.petcare.web.dto.UserLoginRequest;
import com.websoftware_26_1.petcare.web.dto.UserRegisterRequest;
import com.websoftware_26_1.petcare.web.dto.UserResponse;
import com.websoftware_26_1.petcare.web.exception.AuthException;
import java.util.Optional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse register(UserRegisterRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new AuthException("Email already exists.", HttpStatus.CONFLICT);
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User user = User.builder()
            .email(request.getEmail())
            .passwordHash(hashedPassword)
            .nickname(request.getNickname())
            .build();

        User savedUser = userRepository.save(user);
        return toResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public UserResponse login(UserLoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new AuthException("Invalid email or password.", HttpStatus.UNAUTHORIZED));

        boolean matches = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
        if (!matches) {
            throw new AuthException("Invalid email or password.", HttpStatus.UNAUTHORIZED);
        }

        return toResponse(user);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getEmail(), user.getNickname());
    }
}
