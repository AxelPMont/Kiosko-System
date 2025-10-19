package com.kiosko.kiosko_backend.repository;

import com.kiosko.kiosko_backend.model.CategoriaProducto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoriaProductoRepository extends JpaRepository<CategoriaProducto, Long> {
    Optional<CategoriaProducto> findByNombre(String nombre);
    boolean existsByNombre(String nombre);
}

