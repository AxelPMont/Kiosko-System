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
import { abrirCaja, getProductos, registrarVenta, listarCajas } from "../../services/api";

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

// Mock data
const mockProducts: Product[] = [
  { id: "1", name: "Coca Cola 600ml", price: 18.5, category: "bebidas", barcode: "7501055300105", stock: 24 },
  { id: "2", name: "Sabritas Original 45g", price: 15, category: "snacks", barcode: "7501011123274", stock: 15 },
  { id: "3", name: "Chocolate Milky Way", price: 12, category: "dulces", barcode: "7506174500467", stock: 30 },
  { id: "4", name: "Agua Mineral 1L", price: 15, category: "bebidas", barcode: "7501055301102", stock: 20 },
  { id: "5", name: "Doritos Nacho 58g", price: 17, category: "snacks", barcode: "7501011131299", stock: 18 },
  { id: "6", name: "Chocolate Snickers", price: 14, category: "dulces", barcode: "7506174500474", stock: 25 },
  { id: "7", name: "Jugo Del Valle 500ml", price: 16, category: "bebidas", barcode: "7501055302109", stock: 22 },
  { id: "8", name: "Cheetos Torciditos 52g", price: 15, category: "snacks", barcode: "7501011133293", stock: 16 },
  { id: "9", name: "Chocolate Hershey's", price: 20, category: "dulces", barcode: "7506174500481", stock: 28 },
];

const categories = [
  { id: "bebidas", name: "Bebidas", icon: "lucide:coffee" },
  { id: "snacks", name: "Snacks", icon: "lucide:cookie" },
  { id: "dulces", name: "Dulces", icon: "lucide:candy" },
];

const Sales: React.FC = () => {
  const [barcode, setBarcode] = React.useState("");
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const [registerStatus, setRegisterStatus] = React.useState<"open" | "closed" | "loading">("loading");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedTab, setSelectedTab] = React.useState<string>("barcode");
  
  const history = useHistory();
  const barcodeInputRef = React.useRef<HTMLInputElement>(null);

  // Check if register is open
  React.useEffect(() => {
    const status = localStorage.getItem("registerStatus");
    if (status === "open") {
      setRegisterStatus("open");
    } else {
      setRegisterStatus("closed");
    }
  }, []);

  // Focus barcode input on mount and when tab changes to barcode
  React.useEffect(() => {
    if (selectedTab === "barcode" && barcodeInputRef.current) {
      setTimeout(() => {
        barcodeInputRef.current?.focus();
      }, 100);
    }
  }, [selectedTab]);

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode) return;
    
    const product = mockProducts.find(p => p.barcode === barcode);
    
    if (product) {
      addToCart(product);
      setBarcode("");
    } else {
      addToast({
        title: "Producto no encontrado",
        description: `No se encontró un producto con el código ${barcode}`,
        severity: "warning",
      });
    }
    
    // Re-focus the input
    barcodeInputRef.current?.focus();
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get existing sales or initialize empty array
      const existingSales = JSON.parse(localStorage.getItem("sales") || "[]");
      
      // Create new sale
      const newSale = {
        id: Date.now().toString(),
        items: cart,
        total: calculateTotal(),
        timestamp: new Date().toISOString()
      };
      
      // Save updated sales
      localStorage.setItem("sales", JSON.stringify([...existingSales, newSale]));
      
      addToast({
        title: "Venta registrada",
        description: `Venta por S/${calculateTotal().toFixed(2)} registrada correctamente`,
        severity: "success",
      });
      
      // Clear cart
      setCart([]);
      setIsConfirmModalOpen(false);
    } catch (error) {
      addToast({
        title: "Error",
        description: "No se pudo registrar la venta",
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
    ? mockProducts.filter(p => p.category === selectedCategory)
    : mockProducts;

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
                    <Button
                      type="submit"
                      color="primary"
                      isIconOnly
                      className="self-end"
                    >
                      <Icon icon="lucide:search" />
                    </Button>
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
                        variant={selectedCategory === category.id ? "solid" : "flat"}
                        color={selectedCategory === category.id ? "primary" : "default"}
                        onPress={() => setSelectedCategory(prev => prev === category.id ? null : category.id)}
                        startContent={<Icon icon={category.icon} />}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredProducts.map(product => (
                      <motion.div
                        key={product.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          isPressable
                          onPress={() => addToCart(product)}
                          className="h-full"
                        >
                          <CardBody className="p-3 text-center">
                            <div className="flex flex-col items-center">
                              <div className="mb-2">
                                <Icon 
                                  icon={
                                    product.category === "bebidas" ? "lucide:coffee" :
                                    product.category === "snacks" ? "lucide:cookie" :
                                    "lucide:candy"
                                  } 
                                  className="text-2xl text-default-500" 
                                />
                              </div>
                              <p className="text-small font-medium line-clamp-2 mb-1">{product.name}</p>
                              <p className="text-md font-semibold text-primary">${product.price.toFixed(2)}</p>
                            </div>
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
            {cart.length > 0 && (
              <Button
                color="danger"
                variant="flat"
                size="sm"
                onPress={() => setCart([])}
                startContent={<Icon icon="lucide:trash-2" />}
              >
                Vaciar
              </Button>
            )}
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
                    <TableColumn></TableColumn>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.product.id}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Icon icon="lucide:minus" size={16} />
                            </Button>
                            <span className="mx-2 min-w-[20px] text-center">{item.quantity}</span>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="flat"
                              onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Icon icon="lucide:plus" size={16} />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>${item.product.price.toFixed(2)}</TableCell>
                        <TableCell>${(item.product.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            onPress={() => removeFromCart(item.product.id)}
                          >
                            <Icon icon="lucide:x" size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-lg">Total:</span>
                    <span className="font-bold text-xl text-primary">${calculateTotal().toFixed(2)}</span>
                  </div>
                  
                  <Button
                    color="primary"
                    fullWidth
                    size="lg"
                    onPress={() => setIsConfirmModalOpen(true)}
                    startContent={<Icon icon="lucide:check-circle" />}
                  >
                    Confirmar Venta
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
              <ModalHeader className="flex flex-col gap-1">Confirmar Venta</ModalHeader>
              <ModalBody>
                <p>¿Estás seguro de que deseas confirmar esta venta?</p>
                <div className="bg-default-50 p-3 rounded-medium">
                  <div className="flex justify-between mb-2">
                    <span>Total de productos:</span>
                    <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total a pagar:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
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