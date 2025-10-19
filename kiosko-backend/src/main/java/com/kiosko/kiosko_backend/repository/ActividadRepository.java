package com.kiosko.kiosko_backend.repository;

import com.kiosko.kiosko_backend.model.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ActividadRepository extends JpaRepository<Actividad, Long> {

    @Query(value = """
        SELECT * FROM actividades
        ORDER BY fecha_hora DESC
        LIMIT 10
    """, nativeQuery = true)
    List<Actividad> findUltimas10();
}