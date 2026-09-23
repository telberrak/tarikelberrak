package com.tarikelberrak.portfolio.repository;

import com.tarikelberrak.portfolio.domain.ContactSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ContactSubmissionRepository extends JpaRepository<ContactSubmission, UUID> {
}
