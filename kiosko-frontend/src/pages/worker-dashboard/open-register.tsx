import React from "react";
import { useHistory } from "react-router-dom";
import { Card, CardBody, CardHeader, Input, Button, Spinner, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { abrirCaja } from "../../services/api";

const OpenRegister: React.FC = () => {
  const [initialAmount, setInitialAmount] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [registerAlreadyOpen, setRegisterAlreadyOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const history = useHistory();
  // Check if register is already open
  React.useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // ✅ Mostrar toast solo una vez
        addToast({
          title: "Error",
          description: "No se encontró información del usuario autenticado",
          severity: "danger",
        });

        // ✅ Redirigir después de un pequeño retraso
        setTimeout(() => {
          history.push("/login");
        }, 1500);
      }

      const registerStatus = localStorage.getItem("registerStatus");
      if (registerStatus === "open") {
        setRegisterAlreadyOpen(true);
      }
    }, [history]);

  const validateForm = (): boolean => {
    if (!initialAmount) {
      setError("El monto inicial es requerido");
      return false;
    }

    const amount = parseFloat(initialAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("El monto inicial debe ser un número positivo");
      return false;
    }

    setError("");
    return true;
  };

  const handleOpenRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Llamada real a la API (con JWT incluido automáticamente)
      const response = await abrirCaja({
          montoApertura: parseFloat(initialAmount),
      });

      // Guardamos info mínima en localStorage (puede servir para control local)
      const cajaData = response.data;
      localStorage.setItem("registerData", JSON.stringify(cajaData));
      localStorage.setItem("registerStatus", "open");

      addToast({
        title: "Caja abierta",
        description: `Caja abierta con monto inicial de S/${initialAmount}`,
        severity: "success",
        });

        // Redirigir a la página de ventas
        history.push("/worker/sales");
    } catch (error: any) {
      console.error("Error al abrir la caja:", error);

      const msg =
        error.response?.data?.message ||
        error.message ||
        "No se pudo abrir la caja";

        addToast({
            title: "Error",
            description: msg,
            severity: "danger",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoToSales = () => {
    history.push("/worker/sales");
  };

  if (registerAlreadyOpen) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="flex gap-3">
          <Icon icon="lucide:alert-circle" className="text-warning text-xl" />
          <div className="flex flex-col">
            <p className="text-md font-semibold">Caja ya abierta</p>
            <p className="text-small text-default-500">Ya hay una caja abierta en este momento</p>
          </div>
        </CardHeader>
        <CardBody>
          <p className="mb-4">
            No puedes abrir una nueva caja hasta que cierres la actual. Puedes continuar registrando ventas o cerrar la caja actual.
          </p>
          <Button
            color="primary"
            fullWidth
            onPress={handleGoToSales}
            startContent={<Icon icon="lucide:shopping-cart" />}
          >
            Ir a Ventas
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="flex gap-3">
        <Icon icon="lucide:box" className="text-primary text-xl" />
        <div className="flex flex-col">
          <p className="text-md font-semibold">Apertura de Caja</p>
          <p className="text-small text-default-500">Ingresa el monto inicial para abrir la caja</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <Input
            type="number"
            label="Monto Inicial"
            placeholder="0.00"
            value={initialAmount}
            onValueChange={setInitialAmount}
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">S/</span>
              </div>
            }
            isInvalid={!!error}
            errorMessage={error}
            isRequired
          />

          <Button
            color="primary"
            fullWidth
            onPress={handleOpenRegister}
            isLoading={isLoading}
            spinner={<Spinner size="sm" color="white" />}
          >
            Abrir Caja
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default OpenRegister;