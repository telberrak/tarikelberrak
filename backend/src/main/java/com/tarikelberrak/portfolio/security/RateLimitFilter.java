package com.tarikelberrak.portfolio.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Per-client-IP rate limiting for the unauthenticated, abuse-prone endpoints
 * (login/signup/forgot-password/contact). Keyed on the X-Client-IP header,
 * which Next.js sets from the real visitor's address (see
 * src/lib/client-ip.ts on the frontend) — the backend is never reached
 * directly by the browser, so request.getRemoteAddr() would otherwise just
 * be the Next.js container for every visitor.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Set<String> LIMITED_PATHS = Set.of(
            "/api/auth/login",
            "/api/auth/signup",
            "/api/auth/forgot-password",
            "/api/contact");

    private static final int CAPACITY = 10;
    private static final Duration REFILL_PERIOD = Duration.ofMinutes(1);

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        return !LIMITED_PATHS.contains(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String key = clientIp(request) + "|" + request.getRequestURI();
        Bucket bucket = buckets.computeIfAbsent(key, k -> newBucket());

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Too many requests. Please try again shortly.\"}");
        }
    }

    private Bucket newBucket() {
        Bandwidth limit = Bandwidth.classic(CAPACITY, Refill.greedy(CAPACITY, REFILL_PERIOD));
        return Bucket.builder().addLimit(limit).build();
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Client-IP");
        return (forwarded != null && !forwarded.isBlank()) ? forwarded : request.getRemoteAddr();
    }
}
