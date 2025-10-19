package com.kiosko.kiosko_backend.service;

import com.kiosko.kiosko_backend.dto.ActividadResponseDTO;
import com.kiosko.kiosko_backend.model.Actividad;
import com.kiosko.kiosko_backend.repository.ActividadRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActividadService {

    private final ActividadRepository actividadRepository;

    public ActividadService(ActividadRepository actividadRepository) {
        this.actividadRepository = actividadRepository;
    }

    public void registrarActividad(String usuario, String accion, String icono) {
        Actividad actividad = new Actividad(usuario, accion, icono, LocalDateTime.now());
        actividadRepository.save(actividad);
    }

    public List<ActividadResponseDTO> listarUltimasActividades() {
        return actividadRepository.findUltimas10()
                .stream()
                .map(ActividadResponseDTO::new)
                .toList();
    }
}