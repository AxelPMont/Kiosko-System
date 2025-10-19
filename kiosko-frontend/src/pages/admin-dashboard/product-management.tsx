import React from "react";
import {
  getProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  getCategoria,
} from "../../services/api";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Card,
  CardBody,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  addToast,
  Spinner,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface Product {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  price: number;
  stock: number;
  minStock: number;
  status: String;
  barcode: string;
}

interface Category {
  id: number;
  nombre: string;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentProduct, setCurrentProduct] = React.useState<Product | null>(
    null
  );
  const [formData, setFormData] = React.useState({
    name: "",
    categoryId: 0,
    price: 0,
    stock: 0,
    minStock: 0,
    status: "",
    barcode: "",
  });
  const [formErrors, setFormErrors] = React.useState<
    Record<string, string>
  >({});
  const [selectedCategory, setSelectedCategory] =
    React.useState<string>("all");

  // Cargar productos y categorías desde backend
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resProd = await getProductos();
        const resCat = await getCategoria();

        const mappedCat = resCat.data.map((c: any) => ({
          id: c.idCategoria,
          nombre: c.nombre,
        }));
        setCategories(mappedCat);

        const mappedProd = resProd.data.map((p: any) => {
          const category = mappedCat.find((c: Category) => c.nombre === p.categoria);
          return {
            id: p.idProducto,
            name: p.nombre,
            categoryId: category?.id || 0,
            categoryName: p.categoria,
            price: p.precio,
            stock: p.stockActual,
            minStock: p.stockMinimo,
            status: p.estado,
            barcode: p.codigosBarras?.[0] || "",
          };
        });
        setProducts(mappedProd);

      } catch (err) {
        console.error("Error cargando datos:", err);
        addToast({
          title: "Error",
          description: "No se pudieron cargar productos/categorías",
          severity: "danger",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "El nombre es requerido";
      isValid = false;
    }
    if (!formData.categoryId || formData.categoryId === 0) {
      errors.categoryId = "La categoría es requerida";
      isValid = false;
    }
    if (!formData.price || formData.price <= 0) {
      errors.price = "El precio debe ser mayor a 0";
      isValid = false;
    }
    if (formData.stock < 0) {
      errors.stock = "El stock no puede ser negativo";
      isValid = false;
    }
    if (formData.minStock < 0) {
      errors.minStock = "El stock mínimo no puede ser negativo";
      isValid = false;
    }
    if (!formData.barcode.trim()) {
      errors.barcode = "El código de barras es requerido";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Crear producto
  const handleAddProduct = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        nombre: formData.name,
        precio: formData.price,
        stockActual: formData.stock,
        stockMinimo: formData.minStock,
        idCategoria: formData.categoryId,
        codigoBarras: formData.barcode,
      };
      const res = await crearProducto(payload);
      const newProduct: Product = {
        id: res.data.idProducto,
        name: res.data.nombre,
        categoryId: payload.idCategoria,
        categoryName:
          categories.find((c) => c.id === payload.idCategoria)?.nombre || "",
        price: res.data.precio,
        stock: res.data.stockActual,
        minStock: res.data.stockMinimo,
        barcode: res.data.codigosBarras?.[0] || "",
      };
      setProducts((prev) => [...prev, newProduct]);
      setIsAddModalOpen(false);
      resetForm();
      addToast({
        title: "Producto agregado",
        description: `${formData.name} agregado correctamente`,
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      addToast({
        title: "Error",
        description: "No se pudo agregar el producto",
        severity: "danger",
      });
    }
  };

  // Editar producto
  const handleEditProduct = async () => {
    if (!validateForm() || !currentProduct) return;
    try {
      const payload = {
        nombre: formData.name,
        precio: formData.price,
        stockActual: formData.stock,
        stockMinimo: formData.minStock,
        idCategoria: formData.categoryId,
        codigoBarras: formData.barcode,
      };
      const res = await actualizarProducto(currentProduct.id, payload);
      const updated: Product = {
        id: res.data.idProducto,
        name: res.data.nombre,
        categoryId: payload.idCategoria,
        categoryName:
          categories.find((c) => c.id === payload.idCategoria)?.nombre || "",
        price: res.data.precio,
        stock: res.data.stockActual,
        minStock: res.data.stockMinimo,
        barcode: res.data.codigosBarras?.[0] || "",
      };
      setProducts((prev) =>
        prev.map((p) => (p.id === currentProduct.id ? updated : p))
      );
      setIsEditModalOpen(false);
      resetForm();
      addToast({
        title: "Producto actualizado",
        description: `${formData.name} actualizado correctamente`,
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      addToast({
        title: "Error",
        description: "No se pudo actualizar el producto",
        severity: "danger",
      });
    }
  };

  // 🔹 Eliminar producto
  const handleDeleteProduct = async () => {
    if (!currentProduct) return;
    try {
      await eliminarProducto(currentProduct.id);
      setProducts((prev) =>
        prev.filter((p) => p.id !== currentProduct.id)
      );
      setIsDeleteModalOpen(false);
      addToast({
        title: "Producto eliminado",
        description: `${currentProduct.name} eliminado correctamente`,
        severity: "danger",
      });
    } catch (err) {
      console.error(err);
      addToast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        severity: "danger",
      });
      setIsDeleteModalOpen(false);
    }
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      barcode: product.barcode,
    });

    // Log después de setear el formData
    console.log("FormData después de setear:", {
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      barcode: product.barcode,
    });

    setIsEditModalOpen(true);
  };

  const openDeleteModal = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      categoryId: 0,
      price: 0,
      stock: 0,
      minStock: 0,
      barcode: "",
    });
    setFormErrors({});
    setCurrentProduct(null);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.includes(searchTerm);
    const matchesCategory =
      selectedCategory === "all" ||
      product.categoryId === Number(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= 0) return { color: "danger", text: "Sin Stock" };
    if (stock < minStock) return { color: "warning", text: "Bajo" };
    return { color: "success", text: "Normal" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardBody>
          {/* 🔎 Barra de búsqueda y filtros */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <Input
                placeholder="Buscar por nombre o código de barras"
                value={searchTerm}
                onValueChange={setSearchTerm}
                startContent={
                  <Icon icon="lucide:search" className="text-default-400" />
                }
                className="w-full sm:max-w-xs"
              />
              <Select
                placeholder="Filtrar por categoría"
                selectedKeys={[selectedCategory]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setSelectedCategory(selected);
                }}
                className="w-full sm:max-w-xs"
              >
                <SelectItem key="all" value="all">
                  Todas las categorías
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={String(category.id)}
                  >
                    {category.nombre}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <Button
              color="primary"
              onPress={() => setIsAddModalOpen(true)}
              startContent={<Icon icon="lucide:plus" />}
            >
              Agregar Producto
            </Button>
          </div>

          {/* 📋 Tabla de productos */}
          <Table aria-label="Tabla de productos">
            <TableHeader>
              <TableColumn>NOMBRE</TableColumn>
              <TableColumn>CATEGORÍA</TableColumn>
              <TableColumn>PRECIO</TableColumn>
              <TableColumn>STOCK</TableColumn>
              <TableColumn>ESTADO</TableColumn>
              <TableColumn>CÓDIGO</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No se encontraron productos">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(
                  product.stock,
                  product.minStock
                );
                return (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.categoryName}</TableCell>
                    <TableCell>S/. {product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {product.stock} / {product.minStock}
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={
                          stockStatus.color as "success" | "warning" | "danger"
                        }
                        size="sm"
                        variant="flat"
                      >
                        {product.status}
                      </Chip>
                    </TableCell>
                    <TableCell>{product.barcode}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          color="primary"
                          onPress={() => openEditModal(product)}
                        >
                          <Icon icon="lucide:edit" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          color="danger"
                          onPress={() => openDeleteModal(product)}
                        >
                          <Icon icon="lucide:trash" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      {/* ➕ Modal Agregar Producto */}
      <Modal isOpen={isAddModalOpen} onOpenChange={setIsAddModalOpen} onClose={resetForm}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Agregar Producto</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Nombre"
                    placeholder="Nombre del producto"
                    value={formData.name}
                    onValueChange={(value) => handleInputChange("name", value)}
                    isInvalid={!!formErrors.name}
                    errorMessage={formErrors.name}
                    isRequired
                  />
                    <Select
                      label="Categoría"
                      placeholder="Selecciona una categoría"
                      selectedKeys={formData.categoryId > 0 ? new Set([String(formData.categoryId)]) : new Set()}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0];
                        if (selectedKey) {
                          const categoryId = Number(selectedKey);
                          setFormData((prev) => ({ ...prev, categoryId: categoryId }));
                          setFormErrors((prev) => ({ ...prev, categoryId: "" }));
                        }
                      }}
                      isInvalid={!!formErrors.categoryId}
                      errorMessage={formErrors.categoryId}
                      isRequired
                    >
                      {categories.map((category) => (
                        <SelectItem
                          key={String(category.id)}
                          textValue={category.nombre}
                        >
                          {category.nombre}
                        </SelectItem>
                      ))}
                    </Select>
                  <Input
                    type="number"
                    label="Precio"
                    placeholder="0.00"
                    value={formData.price.toString()}
                    onValueChange={(value) => handleInputChange("price", parseFloat(value) || 0)}
                    startContent={<span className="text-default-400">S/.</span>}
                    isInvalid={!!formErrors.price}
                    errorMessage={formErrors.price}
                    isRequired
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      label="Stock Actual"
                      placeholder="0"
                      value={formData.stock.toString()}
                      onValueChange={(value) => handleInputChange("stock", parseInt(value) || 0)}
                      isInvalid={!!formErrors.stock}
                      errorMessage={formErrors.stock}
                    />
                    <Input
                      type="number"
                      label="Stock Mínimo"
                      placeholder="0"
                      value={formData.minStock.toString()}
                      onValueChange={(value) => handleInputChange("minStock", parseInt(value) || 0)}
                      isInvalid={!!formErrors.minStock}
                      errorMessage={formErrors.minStock}
                    />
                  </div>
                  <Input
                    label="Código de Barras"
                    placeholder="Código de barras del producto"
                    value={formData.barcode}
                    onValueChange={(value) => handleInputChange("barcode", value)}
                    isInvalid={!!formErrors.barcode}
                    errorMessage={formErrors.barcode}
                    isRequired
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancelar</Button>
                <Button color="primary" onPress={handleAddProduct}>Agregar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ✏️ Modal Actualizar Producto */}
      <Modal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} onClose={resetForm}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Actualizar Producto</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Nombre"
                    placeholder="Nombre del producto"
                    value={formData.name}
                    onValueChange={(value) => handleInputChange("name", value)}
                    isInvalid={!!formErrors.name}
                    errorMessage={formErrors.name}
                    isRequired
                  />
                  <Select
                    label="Categoría"
                    placeholder="Selecciona una categoría"
                    selectedKeys={formData.categoryId > 0 ? new Set([String(formData.categoryId)]) : new Set()}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0];
                      if (selectedKey) {
                        const categoryId = Number(selectedKey);
                        setFormData((prev) => ({ ...prev, categoryId: categoryId }));
                        setFormErrors((prev) => ({ ...prev, categoryId: "" }));
                      }
                    }}
                    isInvalid={!!formErrors.categoryId}
                    errorMessage={formErrors.categoryId}
                    isRequired
                  >
                    {categories.map((category) => (
                      <SelectItem
                        key={String(category.id)}
                        textValue={category.nombre}
                      >
                        {category.nombre}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    type="number"
                    label="Precio"
                    placeholder="0.00"
                    value={formData.price.toString()}
                    onValueChange={(value) => handleInputChange("price", parseFloat(value) || 0)}
                    startContent={<span className="text-default-400">S/.</span>}
                    isInvalid={!!formErrors.price}
                    errorMessage={formErrors.price}
                    isRequired
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      label="Stock Actual"
                      placeholder="0"
                      value={formData.stock.toString()}
                      onValueChange={(value) => handleInputChange("stock", parseInt(value) || 0)}
                      isInvalid={!!formErrors.stock}
                      errorMessage={formErrors.stock}
                    />
                    <Input
                      type="number"
                      label="Stock Mínimo"
                      placeholder="0"
                      value={formData.minStock.toString()}
                      onValueChange={(value) => handleInputChange("minStock", parseInt(value) || 0)}
                      isInvalid={!!formErrors.minStock}
                      errorMessage={formErrors.minStock}
                    />
                  </div>
                  <Input
                    label="Código de Barras"
                    placeholder="Código de barras del producto"
                    value={formData.barcode}
                    onValueChange={(value) => handleInputChange("barcode", value)}
                    isInvalid={!!formErrors.barcode}
                    errorMessage={formErrors.barcode}
                    isRequired
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancelar</Button>
                <Button color="primary" onPress={handleEditProduct}>Guardar Cambios</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* 🗑️ Modal Eliminar Producto */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} onClose={resetForm}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Eliminar Producto</ModalHeader>
              <ModalBody>
                <p>¿Estás seguro de eliminar <span className="font-bold">{currentProduct?.name}</span>?</p>
                <p className="text-small text-danger">Esta acción no se puede deshacer.</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancelar</Button>
                <Button color="danger" onPress={handleDeleteProduct}>Eliminar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProductManagement;