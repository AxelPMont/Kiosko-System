import React from "react";
import { useHistory } from "react-router-dom";
import { 
  Card, CardBody, CardHeader, Input, Button, Spinner, 
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  addToast
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface RegisterData {
  openedAt: string;
  initialAmount: number;
  status: "open" | "closed";
}

interface SaleItem {
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    barcode: string;
    stock: number;
  };
  quantity: number;
}

interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  timestamp: string;
}

const CloseRegister: React.FC = () => {
  const [registerData, setRegisterData] = React.useState<RegisterData | null>(null);
  const [sales, setSales] = React.useState<Sale[]>([]);
  const [actualAmount, setActualAmount] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const [registerStatus, setRegisterStatus] = React.useState<"open" | "closed" | "loading">("loading");
  
  const history = useHistory();

  // Load register data and sales
  React.useEffect(() => {
    const status = localStorage.getItem("registerStatus");
    const data = localStorage.getItem("registerData");
    const salesData = localStorage.getItem("sales");
    
    if (status === "open" && data) {
      setRegisterStatus("open");
      setRegisterData(JSON.parse(data));
      
      if (salesData) {
        setSales(JSON.parse(salesData));
      }
    } else {
      setRegisterStatus("closed");
    }
  }, []);

  const calculateTotalSales = () => {
    return sales.reduce((total, sale) => total + sale.total, 0);
  };

  const calculateExpectedAmount = () => {
    if (!registerData) return 0;
    return registerData.initialAmount + calculateTotalSales();
  };

  const calculateDifference = () => {
    if (!actualAmount) return 0;
    return parseFloat(actualAmount) - calculateExpectedAmount();
  };

  const validateForm = (): boolean => {
    if (!actualAmount) {
      setError("El monto real es requerido");
      return false;
    }
    
    const amount = parseFloat(actualAmount);
    if (isNaN(amount) || amount < 0) {
      setError("El monto real debe ser un número positivo");
      return false;
    }
    
    setError("");
    return true;
  };

  const handleCloseRegister = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update register data
      if (registerData) {
        const closedRegisterData = {
          ...registerData,
          closedAt: new Date().toISOString(),
          status: "closed",
          actualAmount: parseFloat(actualAmount),
          expectedAmount: calculateExpectedAmount(),
          difference: calculateDifference(),
          totalSales: calculateTotalSales()
        };
        
        // Save closed register data
        localStorage.setItem("closedRegisterData", JSON.stringify(closedRegisterData));
        
        // Clear current register status
        localStorage.removeItem("registerStatus");
        localStorage.removeItem("registerData");
        
        addToast({
          title: "Caja cerrada",
          description: "La caja ha sido cerrada correctamente",
          severity: "success",
        });
        
        // Redirect to open register page
        history.push("/worker/open-register");
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "No se pudo cerrar la caja",
        severity: "danger",
      });
    } finally {
      setIsLoading(false);
      setIsConfirmModalOpen(false);
    }
  };

  const handleOpenRegister = () => {
    history.push("/worker/open-register");
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date);
  };

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
            <p className="text-md font-semibold">No hay caja abierta</p>
            <p className="text-small text-default-500">No hay una caja abierta para cerrar</p>
          </div>
        </CardHeader>
        <CardBody>
          <p className="mb-4">
            Para cerrar una caja, primero debes abrirla con un monto inicial.
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
      {/* Left side - Register summary */}
      <div className="lg:col-span-2">
        <Card className="mb-4">
          <CardHeader className="flex gap-3">
            <Icon icon="lucide:clipboard-check" className="text-primary text-xl" />
            <div className="flex flex-col">
              <p className="text-md font-semibold">Resumen de Caja</p>
              <p className="text-small text-default-500">
                Abierta el {registerData && formatDateTime(registerData.openedAt)}
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Card>
                <CardBody>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon="lucide:wallet" className="text-success" />
                    <span className="text-small text-default-500">Monto Inicial</span>
                  </div>
                  <p className="text-xl font-semibold">
                    ${registerData?.initialAmount.toFixed(2)}
                  </p>
                </CardBody>
              </Card>
              
              <Card>
                <CardBody>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon="lucide:shopping-cart" className="text-primary" />
                    <span className="text-small text-default-500">Total Ventas</span>
                  </div>
                  <p className="text-xl font-semibold">
                    ${calculateTotalSales().toFixed(2)}
                  </p>
                </CardBody>
              </Card>
              
              <Card>
                <CardBody>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon="lucide:calculator" className="text-warning" />
                    <span className="text-small text-default-500">Monto Esperado</span>
                  </div>
                  <p className="text-xl font-semibold">
                    ${calculateExpectedAmount().toFixed(2)}
                  </p>
                </CardBody>
              </Card>
              
              <Card>
                <CardBody>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon="lucide:receipt" className="text-default-500" />
                    <span className="text-small text-default-500">Ventas Realizadas</span>
                  </div>
                  <p className="text-xl font-semibold">
                    {sales.length}
                  </p>
                </CardBody>
              </Card>
            </div>
            
            <div className="mt-6">
              <h3 className="text-md font-medium mb-2">Ventas del día</h3>
              {sales.length === 0 ? (
                <div className="text-center py-8 bg-default-50 rounded-medium">
                  <Icon icon="lucide:shopping-bag" className="text-4xl text-default-300 mx-auto mb-2" />
                  <p className="text-default-500">No hay ventas registradas</p>
                </div>
              ) : (
                <Table removeWrapper aria-label="Sales list">
                  <TableHeader>
                    <TableColumn>ID</TableColumn>
                    <TableColumn>HORA</TableColumn>
                    <TableColumn>PRODUCTOS</TableColumn>
                    <TableColumn>TOTAL</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{sale.id.substring(0, 8)}</TableCell>
                        <TableCell>{formatDateTime(sale.timestamp)}</TableCell>
                        <TableCell>{sale.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                        <TableCell>${sale.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Right side - Close register form */}
      <div>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Cerrar Caja</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <Input
                type="number"
                label="Monto Real en Caja"
                placeholder="0.00"
                value={actualAmount}
                onValueChange={setActualAmount}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">$</span>
                  </div>
                }
                isInvalid={!!error}
                errorMessage={error}
                isRequired
              />
              
              {actualAmount && (
                <div className={`p-3 rounded-medium ${
                  calculateDifference() > 0 
                    ? "bg-success-50 text-success-600" 
                    : calculateDifference() < 0 
                      ? "bg-danger-50 text-danger-600" 
                      : "bg-default-50 text-default-600"
                }`}>
                  <div className="flex justify-between items-center">
                    <span>Diferencia:</span>
                    <span className="font-semibold">
                      ${calculateDifference().toFixed(2)}
                    </span>
                  </div>
                  <p className="text-small mt-1">
                    {calculateDifference() > 0 
                      ? "Hay un sobrante en la caja" 
                      : calculateDifference() < 0 
                        ? "Hay un faltante en la caja" 
                        : "La caja cuadra perfectamente"}
                  </p>
                </div>
              )}
              
              <Button
                color="primary"
                fullWidth
                onPress={() => setIsConfirmModalOpen(true)}
                startContent={<Icon icon="lucide:check-circle" />}
                isDisabled={!actualAmount}
              >
                Cerrar Caja
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Confirm Close Modal */}
      <Modal isOpen={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirmar Cierre de Caja</ModalHeader>
              <ModalBody>
                <p>¿Estás seguro de que deseas cerrar la caja?</p>
                <div className="bg-default-50 p-3 rounded-medium space-y-2">
                  <div className="flex justify-between">
                    <span>Monto inicial:</span>
                    <span>${registerData?.initialAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total ventas:</span>
                    <span>${calculateTotalSales().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monto esperado:</span>
                    <span>${calculateExpectedAmount().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monto real:</span>
                    <span>${parseFloat(actualAmount || "0").toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t border-default-200 pt-2">
                    <span>Diferencia:</span>
                    <span className={
                      calculateDifference() > 0 
                        ? "text-success" 
                        : calculateDifference() < 0 
                          ? "text-danger" 
                          : ""
                    }>
                      ${calculateDifference().toFixed(2)}
                    </span>
                  </div>
                </div>
                <p className="text-small text-default-500 mt-2">
                  Una vez cerrada la caja, no podrás realizar más ventas hasta que abras una nueva.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleCloseRegister}
                  isLoading={isLoading}
                >
                  Confirmar Cierre
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CloseRegister;