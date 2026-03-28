package com.uts.biblioteca.config;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvEntry;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        try {
            File rootDir = new File(System.getProperty("user.dir"));
            Dotenv dotenv = Dotenv.configure()
                    .ignoreIfMalformed()
                    .ignoreIfMissing()
                    .directory(rootDir.getAbsolutePath())
                    .load();

            if (dotenv != null) {
                Map<String, Object> envVars = new HashMap<>();
                for (DotenvEntry entry : dotenv.entries()) {
                    envVars.put(entry.getKey(), entry.getValue());
                }
                
                if (!envVars.isEmpty()) {
                    environment.getPropertySources().addFirst(
                            new MapPropertySource("dotenvProperties", envVars)
                    );
                }
            }
        } catch (Exception e) {
            // Silently ignore if .env doesn't exist
        }
    }
}
