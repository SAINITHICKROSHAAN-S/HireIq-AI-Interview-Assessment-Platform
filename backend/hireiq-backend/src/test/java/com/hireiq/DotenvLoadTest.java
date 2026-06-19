package com.hireiq;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;

@SpringBootTest(properties = {
        "spring.autoconfigure.exclude=" +
                "org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration," +
                "org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration"
})
class DotenvLoadTest {

    @Autowired
    private Environment environment;

    @Test
    void testDotenvPropertiesLoaded() {
        String dbPassword = environment.getProperty("spring.datasource.password");
        String geminiApiKey = environment.getProperty("gemini.api.key");

        assertNotNull(dbPassword);
        assertNotNull(geminiApiKey);

        assertFalse(dbPassword.isBlank());
        assertFalse(geminiApiKey.isBlank());
    }
}