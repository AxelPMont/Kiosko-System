package com.kiosko.kiosko_backend.service;

import com.kiosko.kiosko_backend.dto.CategoriaProductoRequestDTO;
import com.kiosko.kiosko_backend.dto.CategoriaProductoResponseDTO;
import com.kiosko.kiosko_backend.model.CategoriaProducto;
import com.kiosko.kiosko_backend.repository.CategoriaProductoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaProductoService {

    private final CategoriaProductoRepository categoriaProductoRepository;

    public CategoriaProductoService(CategoriaProductoRepository categoriaProductoRepository) {
        this.categoriaProductoRepository = categoriaProductoRepository;
    }

    @Transactional
    public CategoriaProductoResponseDTO registrarCategoria(CategoriaProductoRequestDTO request) {
        if (categoriaProductoRepository.existsByNombre(request.getNombre())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La categoría ya existe");
        }

        CategoriaProducto categoria = new CategoriaProducto();
        categoria.setNombre(request.getNombre());

        return new CategoriaProductoResponseDTO(categoriaProductoRepository.save(categoria));
    }

    @Transactional(readOnly = true)
    public List<CategoriaProductoResponseDTO> listarCategorias() {
        return categoriaProductoRepository.findAll()
                .stream()
                .map(CategoriaProductoResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoriaProductoResponseDTO actualizarCategoria(Long id, CategoriaProductoRequestDTO request) {
        CategoriaProducto existente = categoriaProductoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada"));

        if (!existente.getNombre().equals(request.getNombre()) &&
                categoriaProductoRepository.existsByNombre(request.getNombre())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nuevo nombre ya está en uso");
        }

        existente.setNombre(request.getNombre());

        return new CategoriaProductoResponseDTO(categoriaProductoRepository.save(existente));
    }

    @Transactional
    public void eliminarCategoria(Long id) {
        if (!categoriaProductoRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada");
        }
        categoriaProductoRepository.deleteById(id);
    }
}