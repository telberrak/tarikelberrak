package com.tarikelberrak.portfolio.service;

import com.tarikelberrak.portfolio.domain.Lesson;
import com.tarikelberrak.portfolio.domain.LessonProgress;
import com.tarikelberrak.portfolio.domain.User;
import com.tarikelberrak.portfolio.exception.ApiException;
import com.tarikelberrak.portfolio.repository.LessonProgressRepository;
import com.tarikelberrak.portfolio.repository.LessonRepository;
import com.tarikelberrak.portfolio.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class ProgressService {

    private static final double COMPLETE_THRESHOLD = 0.9;

    private final LessonProgressRepository progressRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;

    public ProgressService(
            LessonProgressRepository progressRepository,
            LessonRepository lessonRepository,
            UserRepository userRepository) {
        this.progressRepository = progressRepository;
        this.lessonRepository = lessonRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public boolean reportProgress(UUID userId, UUID lessonId, int watchedSeconds, int durationSeconds) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> ApiException.notFound("Lesson not found."));

        boolean crossedThreshold = durationSeconds > 0
                && ((double) watchedSeconds / durationSeconds) >= COMPLETE_THRESHOLD;

        LessonProgress progress = progressRepository.findByUserIdAndLessonId(userId, lessonId)
                .orElseGet(() -> LessonProgress.builder()
                        .user(userRepository.getReferenceById(userId))
                        .lesson(lesson)
                        .watchedSeconds(0)
                        .durationSeconds(0)
                        .completed(false)
                        .build());

        progress.setWatchedSeconds(watchedSeconds);
        progress.setDurationSeconds(durationSeconds);

        boolean nowCompleted = progress.getCompleted() || crossedThreshold;
        if (nowCompleted && !progress.getCompleted()) {
            progress.setCompletedAt(Instant.now());
        }
        progress.setCompleted(nowCompleted);

        progressRepository.save(progress);
        return nowCompleted;
    }

    @Transactional
    public void markComplete(UUID userId, UUID lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> ApiException.notFound("Lesson not found."));

        LessonProgress progress = progressRepository.findByUserIdAndLessonId(userId, lessonId)
                .orElseGet(() -> LessonProgress.builder()
                        .user(userRepository.getReferenceById(userId))
                        .lesson(lesson)
                        .watchedSeconds(0)
                        .durationSeconds(lesson.getDurationSeconds())
                        .completed(false)
                        .build());

        progress.setCompleted(true);
        progress.setCompletedAt(Instant.now());
        progressRepository.save(progress);
    }
}
