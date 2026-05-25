package PitagoraBackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Permitir solicitudes desde orígenes específicos (frontend local y producción)
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "http://localhost:3000",
            "http://localhost:8080",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000"
        ));
        
        // Permitir todos los métodos HTTP
        configuration.addAllowedMethod("*");
        
        // Permitir todos los headers
        configuration.addAllowedHeader("*");
        
        // Exponer headers necesarios
        configuration.addExposedHeader("Content-Type");
        configuration.addExposedHeader("Authorization");
        
        // Permitir credenciales
        configuration.setAllowCredentials(true);
        
        // Tiempo máximo que el navegador puede cachear la respuesta preflight
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }
}
