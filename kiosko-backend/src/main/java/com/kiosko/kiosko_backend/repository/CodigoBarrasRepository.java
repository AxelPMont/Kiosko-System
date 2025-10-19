package com.kiosko.kiosko_backend.repository;

import com.kiosko.kiosko_backend.model.CodigoBarras;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CodigoBarrasRepository extends JpaRepository<CodigoBarras, Long> {
    boolean existsByCodigo(String codigo);
}
