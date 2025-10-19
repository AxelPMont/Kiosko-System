package com.kiosko.kiosko_backend.repository;

import com.kiosko.kiosko_backend.model.Caja;
import com.kiosko.kiosko_backend.model.Caja.Estado;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CajaRepository extends JpaRepository<Caja, Long> {
    Optional<Caja> findByEstado(Estado estado);
    Optional<Caja> findByUsuarioIdUsuarioAndFechaCierreIsNull(Long usuarioId);
}