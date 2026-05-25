package com.websoftware_26_1.petcare.web;

import com.websoftware_26_1.petcare.service.GeminiIntroService;
import com.websoftware_26_1.petcare.service.GeminiIntroService.DebugResult;
import com.websoftware_26_1.petcare.service.GeminiIntroService.IntroPrompt;
import com.websoftware_26_1.petcare.service.GeminiIntroService.Usage;
import com.websoftware_26_1.petcare.web.dto.ApiResponse;
import com.websoftware_26_1.petcare.web.dto.GeminiDebugRequest;
import com.websoftware_26_1.petcare.web.dto.GeminiDebugResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/debug/gemini")
public class GeminiDebugController {

    private final GeminiIntroService geminiIntroService;

    public GeminiDebugController(GeminiIntroService geminiIntroService) {
        this.geminiIntroService = geminiIntroService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GeminiDebugResponse>> debug(@RequestBody GeminiDebugRequest request) {
        IntroPrompt prompt = new IntroPrompt(
            request.getKind(),
            request.getGender(),
            request.getAge(),
            request.getWeight(),
            request.getColor(),
            request.getDiscoveryPlace(),
            request.getDescription(),
            request.getSocialization(),
            request.getHealthStatus()
        );
        DebugResult result = geminiIntroService.debugGenerate(prompt, request.isStrict());
        Usage usage = result.usage();
        GeminiDebugResponse response = new GeminiDebugResponse(
            result.prompt(),
            result.intro(),
            usage != null ? usage.promptTokens() : null,
            usage != null ? usage.candidateTokens() : null,
            usage != null ? usage.totalTokens() : null
        );
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
