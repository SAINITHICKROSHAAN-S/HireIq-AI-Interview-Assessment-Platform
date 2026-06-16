package com.hireiq.service;

import com.hireiq.dto.AuthResponse;
import com.hireiq.dto.LoginRequest;
import com.hireiq.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
