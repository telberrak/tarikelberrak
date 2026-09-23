package com.tarikelberrak.portfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;

// UserDetailsServiceAutoConfiguration is excluded because auth is handled entirely by
// JwtAuthFilter/JwtService — there's no Spring Security UserDetailsService/AuthenticationManager
// in play, so its default in-memory user (and the "Using generated security password" log
// warning) would otherwise be created for nothing.
//
// ManagementWebSecurityAutoConfiguration is excluded because actuator runs on its own
// port (management.server.port, see application.yml) specifically so it's never routed
// through the public reverse proxy — see deploy/Caddyfile — and network isolation is
// the intended access control for it, not a second, redundant auth layer that Prometheus
// would otherwise need credentials to get past.
@SpringBootApplication(exclude = {UserDetailsServiceAutoConfiguration.class, ManagementWebSecurityAutoConfiguration.class})
@EnableScheduling
public class PortfolioApplication {
    public static void main(String[] args) {
        SpringApplication.run(PortfolioApplication.class, args);
    }
}
