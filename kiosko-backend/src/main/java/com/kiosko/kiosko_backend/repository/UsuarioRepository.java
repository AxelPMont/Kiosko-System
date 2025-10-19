package com.kiosko.kiosko_backend.repository;

import com.kiosko.kiosko_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import com.kiosko.kiosko_backend.model.Usuario.Rol;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByNombreUsuario(String nombreUsuario);
    List<Usuario> findByEstado(Usuario.Estado estado);
    long countByRol(Rol rol);
}
