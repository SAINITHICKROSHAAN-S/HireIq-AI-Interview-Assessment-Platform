package com.hireiq.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.hireiq.dto.ResumeAnalysisResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GeminiAIService implements AIService {

    @Value("${gemini.api.key:PLACEHOLDER_KEY}")
    private String apiKey;

    private final ObjectMapper objectMapper;

    @Override
    public ResumeAnalysisResponse analyzeResume(String resumeText) {
        String prompt = buildPrompt(resumeText);

        try {
            // Initialize the official Google GenAI Client
            Client client = Client.builder()
                    .apiKey(apiKey)
                    .build();

            // Set up generation config for structured JSON output
            GenerateContentConfig config = GenerateContentConfig.builder()
                    .responseMimeType("application/json")
                    .build();

            // Execute generate content
            GenerateContentResponse response = client.models.generateContent(
                    "gemini-2.5-flash",
                    prompt,
                    config
            );

            if (response == null || response.text() == null) {
                throw new IllegalStateException("Failed to receive a valid response text from Gemini AI service");
            }

            String jsonText = response.text();
            return objectMapper.readValue(jsonText, ResumeAnalysisResponse.class);

        } catch (Exception e) {
            throw new RuntimeException("Error occurred during resume analysis processing: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(String resumeText) {
        return "You are an expert AI Resume Analyzer for HireIQ. Analyze the following resume content and output a JSON response containing an overall score (0 to 100), key strengths, major weaknesses, and actionable suggestions. "
                + "You must return a valid JSON object matching the following structure strictly: "
                + "{\n"
                + "  \"overallScore\": 85,\n"
                + "  \"strengths\": [\"Strength 1\", \"Strength 2\"],\n"
                + "  \"weaknesses\": [\"Weakness 1\", \"Weakness 2\"],\n"
                + "  \"suggestions\": [\"Suggestion 1\", \"Suggestion 2\"]\n"
                + "}\n"
                + "Here is the resume content:\n"
                + resumeText;
    }
}
