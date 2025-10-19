import React from "react";
import { Card, CardBody, Input, Button, Checkbox, Spinner, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../../contexts/auth-context";
import logo from "../../assets/logo-sd.png";

const LoginPage: React.FC = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({
    username: "",
    password: "",
  });

  const { login } = useAuth();

  const validateForm = (): boolean => {
    const newErrors = { username: "", password: "" };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = "El nombre de usuario es requerido";
      isValid = false;
    }
    if (!password) {
      newErrors.password = "La contraseña es requerida";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(username, password);

      addToast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al sistema POS",
        severity: "success",
      });
    } catch (error: any) {
      addToast({
        title: "Error de inicio de sesión",
        description: error.message || "Usuario o contraseña incorrectos",
        severity: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Logo" className="w-25 h-25" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">POS Kiosko</h1>
          <p className="text-gray-600 mt-2">Inicia sesión para acceder al sistema</p>
        </div>

        <Card shadow="sm" className="w-full">
          <CardBody className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Usuario"
                placeholder="Ingresa tu usuario"
                value={username}
                onValueChange={setUsername}
                startContent={<Icon icon="lucide:user" className="text-default-400" />}
                isInvalid={!!errors.username}
                errorMessage={errors.username}
                isRequired
              />

              <Input
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                type="password"
                value={password}
                onValueChange={setPassword}
                startContent={<Icon icon="lucide:lock" className="text-default-400" />}
                isInvalid={!!errors.password}
                errorMessage={errors.password}
                isRequired
              />

              <div className="flex items-center justify-between">
                <Checkbox
                  isSelected={rememberMe}
                  onValueChange={setRememberMe}
                >
                  Recordarme
                </Checkbox>

                <Button
                  variant="light"
                  color="primary"
                  size="sm"
                  className="p-0"
                >
                  ¿Olvidaste tu contraseña?
                </Button>
              </div>

              <Button
                type="submit"
                color="primary"
                fullWidth
                isLoading={isLoading}
                spinner={<Spinner size="sm" color="white" />}
              >
                Iniciar Sesión
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;