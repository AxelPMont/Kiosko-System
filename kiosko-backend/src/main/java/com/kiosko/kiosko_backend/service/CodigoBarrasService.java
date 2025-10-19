package com.kiosko.kiosko_backend.service;

import com.kiosko.kiosko_backend.dto.CodigoBarrasRequestDTO;
import com.kiosko.kiosko_backend.dto.CodigoBarrasResponseDTO;
import com.kiosko.kiosko_backend.model.CodigoBarras;
import com.kiosko.kiosko_backend.model.Producto;
import com.kiosko.kiosko_backend.repository.CodigoBarrasRepository;
import com.kiosko.kiosko_backend.repository.ProductoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CodigoBarrasService {

    private final CodigoBarrasRepository codigoBarrasRepository;
    private final ProductoRepository productoRepository;

    public CodigoBarrasService(CodigoBarrasRepository codigoBarrasRepository,
                               ProductoRepository productoRepository) {
        this.codigoBarrasRepository = codigoBarrasRepository;
        this.productoRepository = productoRepository;
    }

    @Transactional
    public CodigoBarrasResponseDTO registrarCodigoBarras(CodigoBarrasRequestDTO request) {
        if (codigoBarrasRepository.existsByCodigo(request.getCodigo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El código de barras ya existe");
        }

        Producto producto = productoRepository.findById(request.getIdProducto())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));

        CodigoBarras codigoBarras = new CodigoBarras();
        codigoBarras.setCodigo(request.getCodigo());
        codigoBarras.setProducto(producto);

        return new CodigoBarrasResponseDTO(codigoBarrasRepository.save(codigoBarras));
    }

    @Transactional(readOnly = true)
    public List<CodigoBarrasResponseDTO> listarCodigosBarras() {
        return codigoBarrasRepository.findAll()
                .stream()
                .map(CodigoBarrasResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public CodigoBarrasResponseDTO actualizarCodigoBarras(Long id, CodigoBarrasRequestDTO request) {
        CodigoBarras existente = codigoBarrasRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Código de barras no encontrado"));

        if (!existente.getCodigo().equals(request.getCodigo()) &&
                codigoBarrasRepository.existsByCodigo(request.getCodigo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nuevo código ya existe");
        }

        Producto producto = productoRepository.findById(request.getIdProducto())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));

        existente.setCodigo(request.getCodigo());
        existente.setProducto(producto);

        return new CodigoBarrasResponseDTO(codigoBarrasRepository.save(existente));
    }

    @Transactional
    public void eliminarCodigoBarras(Long id) {
        if (!codigoBarrasRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Código de barras no encontrado");
        }
        codigoBarrasRepository.deleteById(id);
    }
}