import React from "react";
import { useHistory } from "react-router-dom";
import { 
  Card, CardBody, CardHeader, Input, Button, Spinner, 
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  addToast, Tabs, Tab
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { registrarVenta, getProductoPorCodigo, getVentaActiva, getCategoria, getProductos, cerrarCaja } from "../../services/api";

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  barcode: string;
  stock: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const iconMap: Record<string, string> = {
  Bebida: "lucide:cup-soda",
  Dulce: "lucide:candy",
  Snack: "lucide:sandwich",
};

const Sales: React.FC = () => {
  const [barcode, setBarcode] = React.useState("");
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const [registerStatus, setRegisterStatus] = React.useState<"open" | "closed" | "loading">("loading");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedTab, setSelectedTab] = React.useState<string>("barcode");
  const [productos, setProductos] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<
    { id: number; name: string; icon: string }[]
  >([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const history = useHistory();
  const barcodeInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const verificarCaja = async () => {
      try {
        const cajaAbierta = JSON.parse(localStorage.getItem("cajaAbierta") || "null");

        if (cajaAbierta && cajaAbierta.estado === "abierta") {
          setRegisterStatus("open");
        } else {
          setRegisterStatus("closed");
        }
      } catch (error) {
        console.error("Error al verificar caja:", error);
        setRegisterStatus("closed");
      }
    };

    verificarCaja();
  }, []);

  React.useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const { data } = await getCategoria();

        const mapped = data.map((cat: any) => ({
          id: cat.idCategoria,
          name: cat.nombre,
          icon: iconMap[cat.nombre] || "lucide:package", // icono genérico si no hay coincidencia
        }));

        setCategories(mapped);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  React.useEffect(() => {
    const fetchProductos = async () => {
      try {
        const { data } = await getProductos();
        const mapped = data.map((p: any) => ({
          id: p.idProducto,
          name: p.nombre,
          price: p.precio,
          category: p.categoria || "Sin categoría",
          barcode: p.codigoBarras,
          stock: p.stock,
        }));
        setProductos(mapped);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProductos();
  }, []);

  // Check if register is open
  React.useEffect(() => {
    const fetchVentaActiva = async () => {
      try {
        if (registerStatus === "open" && user?.idUsuario) {
          const response = await getVentaActiva(user.idUsuario);
          const venta = response.data;

          if (venta && venta.detalleVenta && venta.detalleVenta.length > 0) {
            const mappedItems = venta.detalleVenta.map((detalle: any) => ({
              product: {
                id: detalle.producto.idProducto,
                name: detalle.producto.nombre,
                price: detalle.producto.precio,
                category: detalle.producto.categoria?.nombre || "Sin categoría",
                barcode: detalle.producto.codigoBarras,
                stock: detalle.producto.stock,
              },
              quantity: detalle.cantidad,
            }));

            setCart(mappedItems);
          }
        }
      } catch (error) {
        console.error("Error al obtener la venta activa:", error);
      }
    };

    fetchVentaActiva();
  }, [registerStatus]);

  // Focus barcode input on mount and when tab changes to barcode
  React.useEffect(() => {
    if (selectedTab === "barcode" && barcodeInputRef.current) {
      setTimeout(() => {
        barcodeInputRef.current?.focus();
      }, 100);
    }
  }, [selectedTab]);

  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode) return;

    try {
      setIsLoading(true);

      // 1️⃣ Buscar producto real por código
      const { data: producto } = await getProductoPorCodigo(barcode);

      if (!producto) {
        addToast({
          title: "Producto no encontrado",
          description: "No existe un producto con ese código de barras.",
          severity: "warning",
        });
        setBarcode("");
        return;
      }

      // 2️⃣ Registrar la venta con el usuario logueado
      const ventaRequest = {
        idUsuario: user?.id, // ⚠️ Usamos el id del login
        detalles: [
          {
            idProducto: producto.idProducto,
            cantidad: 1,
            precioUnitario: producto.precio,
          },
        ],
      };

      const { data: ventaCreada } = await registrarVenta(ventaRequest);

      // 3️⃣ Agregar el producto escaneado al carrito local
      setCart((prev) => {
        const existente = prev.find((i) => i.product.id === producto.idProducto);
        if (existente) {
          return prev.map((i) =>
            i.product.id === producto.idProducto
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        } else {
          return [
            ...prev,
            {
              product: {
                id: producto.idProducto,
                name: producto.nombre,
                price: producto.precio,
                category: producto.categoria?.nombre || "Sin categoría",
                barcode: producto.codigoBarras || "",
                stock: producto.stock || 0,
              },
              quantity: 1,
            },
          ];
        }
      });

      // 4️⃣ Mostrar notificación
      addToast({
        title: "Producto agregado",
        description: `${producto.nombre} se registró correctamente en la venta.`,
        severity: "success",
      });

      // 5️⃣ Limpiar input y mantener foco
      setBarcode("");
      barcodeInputRef.current?.focus();
    } catch (error: any) {
      console.error("Error al registrar venta:", error);
      addToast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "No se pudo registrar la venta o el producto no existe.",
        severity: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    } else {
      setCart(prevCart => 
        prevCart.map(item => 
          item.product.id === productId 
            ? { ...item, quantity } 
            : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleConfirmSale = async () => {
    setIsLoading(true);

    try {
      const totalVenta = calculateTotal();
      const cajaAbierta = JSON.parse(localStorage.getItem("cajaAbierta") || "null");

      if (!cajaAbierta || !cajaAbierta.idCaja) {
        throw new Error("No hay una caja abierta actualmente.");
      }

      // Llamar al backend para cerrar la caja
      await cerrarCaja(cajaAbierta.idCaja, totalVenta);

      // Actualizar estado local
      localStorage.removeItem("cajaAbierta");
      setRegisterStatus("closed");

      addToast({
        title: "Caja cerrada",
        description: `La caja fue cerrada correctamente con un monto de cierre de S/${totalVenta.toFixed(2)}`,
        severity: "success",
      });

      // Vaciar carrito y cerrar modal
      setCart([]);
      setIsConfirmModalOpen(false);

      localStorage.removeItem("registerStatus");
      localStorage.removeItem("cajaAbierta");
    } catch (error: any) {
      console.error("Error al cerrar la caja:", error);
      addToast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "No se pudo cerrar la caja. Verifica que haya una caja abierta.",
        severity: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenRegister = () => {
    history.push("/worker/open-register");
  };

  const filteredProducts = selectedCategory
    ? productos.filter((p) => p.category === selectedCategory)
    : productos;

  if (registerStatus === "loading") {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (registerStatus === "closed") {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="flex gap-3">
          <Icon icon="lucide:alert-circle" className="text-warning text-xl" />
          <div className="flex flex-col">
            <p className="text-md font-semibold">Caja cerrada</p>
            <p className="text-small text-default-500">Necesitas abrir la caja para registrar ventas</p>
          </div>
        </CardHeader>
        <CardBody>
          <p className="mb-4">
            Para registrar ventas, primero debes abrir la caja con un monto inicial.
          </p>
          <Button
            color="primary"
            fullWidth
            onPress={handleOpenRegister}
            startContent={<Icon icon="lucide:box" />}
          >
            Abrir Caja
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left side - Product search */}
      <div className="lg:col-span-2">
        <Card className="mb-4">
          <CardBody>
            <Tabs 
              selectedKey={selectedTab} 
              onSelectionChange={(key) => setSelectedTab(key as string)}
              aria-label="Product search options"
            >
              <Tab 
                key="barcode" 
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:barcode" />
                    <span>Código de Barras</span>
                  </div>
                }
              >
                <div className="py-2">
                  <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
                    <Input
                      ref={barcodeInputRef}
                      label="Código de Barras"
                      placeholder="Escanea o ingresa el código"
                      value={barcode}
                      onValueChange={setBarcode}
                      startContent={<Icon icon="lucide:barcode" className="text-default-400" />}
                      className="flex-1"
                      autoFocus
                    />
                  </form>
                  <p className="text-small text-default-500 mt-2">
                    Escanea el código de barras o ingrésalo manualmente y presiona Enter
                  </p>
                </div>
              </Tab>
              <Tab 
                key="categories" 
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:layers" />
                    <span>Categorías</span>
                  </div>
                }
              >
                <div className="py-2">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map(category => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.name ? "solid" : "flat"}
                        color={selectedCategory === category.name ? "primary" : "default"}
                        onPress={() =>
                          setSelectedCategory((prev) =>
                            prev === category.name ? null : category.name
                          )
                        }
                        startContent={<Icon icon={category.icon} />}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {filteredProducts.map((product) => (
                      <motion.div key={product.id}>
                        <Card
                          shadow="sm"
                          className="h-36 flex flex-col justify-center items-center text-center border border-default-200 bg-default-50"
                        >
                          <CardBody className="flex flex-col items-center justify-center p-3 space-y-2">
                            <Icon
                              icon={iconMap[product.category] || "lucide:package"}
                              className="text-3xl text-default-500"
                            />
                            <p className="text-sm font-medium text-default-700 text-center leading-tight">
                              {product.name}
                            </p>
                            <p className="text-md font-semibold text-primary">
                              S/.{product.price.toFixed(2)}
                            </p>
                          </CardBody>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
      
      {/* Right side - Cart */}
      <div>
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Carrito</h3>
          </CardHeader>
          <CardBody>
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <Icon icon="lucide:shopping-cart" className="text-4xl text-default-300 mx-auto mb-2" />
                <p className="text-default-500">El carrito está vacío</p>
                <p className="text-small text-default-400">
                  Escanea o selecciona productos para agregarlos
                </p>
              </div>
            ) : (
              <>
                <Table removeWrapper aria-label="Cart items">
                  <TableHeader>
                    <TableColumn>PRODUCTO</TableColumn>
                    <TableColumn>CANT.</TableColumn>
                    <TableColumn>PRECIO</TableColumn>
                    <TableColumn>SUBTOTAL</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.product.id}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell>S/.{item.product.price.toFixed(2)}</TableCell>
                        <TableCell>S/.{(item.product.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-lg">Total:</span>
                    <span className="font-bold text-xl text-primary">S/{calculateTotal().toFixed(2)}</span>
                  </div>
                  
                  <Button
                    color="primary"
                    fullWidth
                    size="lg"
                    onPress={() => setIsConfirmModalOpen(true)}
                    startContent={<Icon icon="lucide:check-circle" />}
                  >
                    Cerrar Caja
                  </Button>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>
      
      {/* Confirm Sale Modal */}
      <Modal isOpen={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Cerrar Caja</ModalHeader>
              <ModalBody>
                <p>¿Estás seguro de que deseas cerrar la caja?</p>
                <div className="bg-default-50 p-3 rounded-medium">
                  <div className="flex justify-between mb-2">
                    <span>Total de productos:</span>
                    <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total a pagar:</span>
                    <span>S/{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleConfirmSale}
                  isLoading={isLoading}
                >
                  Confirmar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Sales;