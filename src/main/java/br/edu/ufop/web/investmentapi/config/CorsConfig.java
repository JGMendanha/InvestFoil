package br.edu.ufop.web.investmentapi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Permite CORS para todos os endpoints
                .allowedOrigins("http://localhost:5173") // Origem do seu frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // Métodos HTTP permitidos
                .allowedHeaders("*") // Todos os cabeçalhos
                .allowCredentials(true); // Permite envio de cookies/autenticação (se necessário)
    }
}