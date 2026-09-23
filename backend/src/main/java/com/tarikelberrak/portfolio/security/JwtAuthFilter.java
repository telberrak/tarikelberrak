package com.tarikelberrak.portfolio.security;

import com.tarikelberrak.portfolio.service.RevokedTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final RevokedTokenService revokedTokenService;

    public JwtAuthFilter(JwtService jwtService, RevokedTokenService revokedTokenService) {
        this.jwtService = jwtService;
        this.revokedTokenService = revokedTokenService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                AuthPrincipal principal = jwtService.parse(token);

                if (!revokedTokenService.isRevoked(principal.jti())) {
                    List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                    authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                    if (principal.isAdmin()) authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));

                    var authentication = new UsernamePasswordAuthenticationToken(principal, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    SecurityContextHolder.clearContext();
                }
            } catch (Exception ignored) {
                // Invalid/expired token — leave the context unauthenticated;
                // endpoints that require auth will reject with 401 downstream.
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
