package com.tarikelberrak.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ContactDtos {

    public record ContactRequest(
            @NotBlank @Size(min = 2, max = 200) String name,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 10, max = 5000) String message) {
    }
}
