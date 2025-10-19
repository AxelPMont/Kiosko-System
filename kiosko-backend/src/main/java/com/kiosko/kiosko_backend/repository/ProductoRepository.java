package com.kiosko.kiosko_backend.repository;

import com.kiosko.kiosko_backend.dto.CategoriaProductoResumenDTO;
import com.kiosko.kiosko_backend.model.CodigoBarras;
import com.kiosko.kiosko_backend.model.Producto;
import com.kiosko.kiosko_backend.model.Producto.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    Optional<Producto> findById(Long id);
    Optional<Producto> findByCodigosBarras_Codigo(String codigo);

    @Query("SELECT COUNT(p) FROM Producto p WHERE p.stockActual < p.stockMinimo")
    long countProductosBajoStock();

    @Query("SELECT new com.kiosko.kiosko_backend.dto.CategoriaProductoResumenDTO(p.categoria.nombre, COUNT(p)) " +
            "FROM Producto p GROUP BY p.categoria.nombre ORDER BY COUNT(p) DESC")
    List<CategoriaProductoResumenDTO> obtenerResumenPorCategoria();

    @Query(value = """
    SELECT p.nombre, p.stock_actual, p.stock_minimo
    FROM producto p
    WHERE p.stock_actual < p.stock_minimo
    ORDER BY p.stock_actual ASC
    """, nativeQuery = true)
    List<Object[]> findProductosConBajoStock();
}
