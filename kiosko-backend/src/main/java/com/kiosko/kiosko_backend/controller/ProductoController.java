package com.kiosko.kiosko_backend.controller;

import com.kiosko.kiosko_backend.dto.CategoriaProductoResumenDTO;
import com.kiosko.kiosko_backend.dto.ProductoBajoStockDTO;
import com.kiosko.kiosko_backend.dto.ProductoRequestDTO;
import com.kiosko.kiosko_backend.dto.ProductoResponseDTO;
import com.kiosko.kiosko_backend.model.CodigoBarras;
import com.kiosko.kiosko_backend.model.Producto;
import com.kiosko.kiosko_backend.model.Producto.Estado;
import com.kiosko.kiosko_backend.repository.CodigoBarrasRepository;
import com.kiosko.kiosko_backend.repository.ProductoRepository;
import com.kiosko.kiosko_backend.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/producto")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public List<ProductoResponseDTO> listarProductos() {
        return productoService.listarProductos();
    }

    @GetMapping("/{id}")
    public ProductoResponseDTO buscarPorId(@PathVariable Long id) {
        return productoService.buscarPorId(id);
    }

    @GetMapping("/codigo/{codigo}")
    public ProductoResponseDTO buscarPorCodigoBarras(@PathVariable String codigo) {
        return productoService.buscarPorCodigoBarras(codigo);
    }

    @GetMapping("/resumen-categorias")
    public List<CategoriaProductoResumenDTO> obtenerResumenPorCategoria() {
        return productoService.obtenerResumenPorCategoria();
    }

    @GetMapping("/bajo-stock")
    public List<ProductoBajoStockDTO> listarProductosConBajoStock() {
        return productoService.obtenerProductosConBajoStock();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductoResponseDTO crearProducto(@Valid @RequestBody ProductoRequestDTO request) {
        return productoService.registrarProducto(request);
    }

    @PutMapping("/{id}")
    public ProductoResponseDTO actualizarProducto(@PathVariable Long id,
                                                  @Valid @RequestBody ProductoRequestDTO request) {
        return productoService.actualizarProducto(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
    }
}
