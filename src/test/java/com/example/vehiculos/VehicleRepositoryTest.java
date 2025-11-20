package com.example.vehiculos;

import com.example.vehiculos.repository.VehicleRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest
public class VehicleRepositoryTest {

    @MockBean
    private VehicleRepository repository;

    @Test
    public void testConnection() {
        // Test that the repository bean is injected
        assertThat(repository).isNotNull();
    }
}