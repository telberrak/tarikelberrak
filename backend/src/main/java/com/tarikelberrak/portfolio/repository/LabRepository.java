package com.tarikelberrak.portfolio.repository;

import com.tarikelberrak.portfolio.domain.Lab;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LabRepository extends JpaRepository<Lab, UUID> {
    List<Lab> findByPublishedTrueOrderByLabDateDesc();
    List<Lab> findAllByOrderByLabDateDesc();
    Optional<Lab> findBySlugAndPublishedTrue(String slug);
    Optional<Lab> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
