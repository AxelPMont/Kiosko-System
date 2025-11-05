package com.kiosko.kiosko_backend.service;

import com.kiosko.kiosko_backend.dto.CategoriaProductoResumenDTO;
import com.kiosko.kiosko_backend.dto.ProductoBajoStockDTO;
import com.kiosko.kiosko_backend.dto.ProductoRequestDTO;
import com.kiosko.kiosko_backend.dto.ProductoResponseDTO;
import com.kiosko.kiosko_backend.model.CategoriaProducto;
import com.kiosko.kiosko_backend.model.CodigoBarras;
import com.kiosko.kiosko_backend.model.Producto;
import com.kiosko.kiosko_backend.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductoService {


    private final ProductoRepository productoRepository;
    private final CategoriaProductoRepository categoriaRepository;
    private final DetalleVentaRepository detalleVentaRepository;
    private final CodigoBarrasRepository codigoBarrasRepository;
    private final ActividadService actividadService;

    public ProductoService(ProductoRepository productoRepository, CategoriaProductoRepository categoriaRepostory, CodigoBarrasRepository codigoBarrasRepository, DetalleVentaRepository detalleVentaRepository, ActividadService actividadService) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepostory;
        this.detalleVentaRepository = detalleVentaRepository;
        this.codigoBarrasRepository = codigoBarrasRepository;
        this.actividadService = actividadService;
    }

    @Transactional
    public ProductoResponseDTO registrarProducto(ProductoRequestDTO request) {
        CategoriaProducto categoria = categoriaRepository.findById(request.getIdCategoria())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no econtrada"));

        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setPrecio(request.getPrecio());
        producto.setStockActual(request.getStockActual());
        producto.setStockMinimo(request.getStockMinimo());
        producto.setCategoria(categoria);

        Producto productoGuardado = productoRepository.save(producto);

        CodigoBarras codigo = new CodigoBarras();
        codigo.setCodigo(request.getCodigoBarras());
        codigo.setProducto(productoGuardado);
        codigoBarrasRepository.save(codigo);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        actividadService.registrarActividad(username, "registró un nuevo producto", "lucide:package");

        return new ProductoResponseDTO(productoGuardado);
    }

    @Transactional
    public List<ProductoResponseDTO> listarProductos() {
        return productoRepository.findAll()
                .stream()
                .map(ProductoResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductoResponseDTO buscarPorId(Long id) {
        return productoRepository.findById(id)
                .map(ProductoResponseDTO::new)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
    }

    @Transactional(readOnly = true)
    public ProductoResponseDTO buscarPorCodigoBarras(String codigo) {
        return productoRepository.findByCodigosBarras_Codigo(codigo)
                .map(ProductoResponseDTO::new)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
    }

    @Transactional
    public ProductoResponseDTO actualizarProducto(Long id, ProductoRequestDTO dto) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));

        CategoriaProducto categoria = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada"));

        producto.setNombre(dto.getNombre());
        producto.setPrecio(dto.getPrecio());
        producto.setStockActual(dto.getStockActual());
        producto.setStockMinimo(dto.getStockMinimo());
        producto.setCategoria(categoria);

        Producto productoGuardado = productoRepository.save(producto);

        CodigoBarras codigo = new CodigoBarras();
        codigo.setCodigo(dto.getCodigoBarras());
        codigo.setProducto(productoGuardado);
        codigoBarrasRepository.save(codigo);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        actividadService.registrarActividad(username, "Actualizó un producto", "lucide:package-check");

        return new ProductoResponseDTO(productoGuardado);
    }

    @Transactional
    public void eliminarProducto(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado");
        }
        if (detalleVentaRepository.existsByProducto_IdProducto(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "No se puede eliminar el producto porque ya tiene ventas registradas");
        }
        productoRepository.deleteById(id);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        actividadService.registrarActividad(username, "Eliminó un producto", "lucide:package-x");
    }

    @Transactional(readOnly = true)
    public List<CategoriaProductoResumenDTO> obtenerResumenPorCategoria() {
        return productoRepository.obtenerResumenPorCategoria();
    }

    @Transactional(readOnly = true)
    public List<ProductoBajoStockDTO> obtenerProductosConBajoStock() {
        return productoRepository.findProductosConBajoStock().stream()
                .map(obj -> new ProductoBajoStockDTO(
                        (String) obj[0],
                        ((Number) obj[1]).intValue(),
                        ((Number) obj[2]).intValue()
                ))
                .toList();
    }
}
