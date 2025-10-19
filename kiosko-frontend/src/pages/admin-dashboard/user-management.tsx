import React from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Input, Card, CardBody, Chip, Modal, ModalContent, ModalHeader,
  ModalBody, ModalFooter, Select, SelectItem, addToast, Spinner
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  getUsuarios,
  registrarUsuario,
  cambiarEstadoUsuario,
} from "../../services/api";

// Interfaces
interface User {
  id: number;
  username: string;
  fullName: string;
  role: "admin" | "worker";
  status: "active" | "inactive";
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isToggleModalOpen, setIsToggleModalOpen] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

  const [formData, setFormData] = React.useState<Omit<User, "id">>({
    username: "",
    fullName: "",
    role: "worker",
    status: "active",
  });
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({});
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [selectedRole, setSelectedRole] = React.useState<string>("all");

  // Cargar usuarios del backend
  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsuarios();
      const mapped: User[] = res.data.map((u: any) => ({
        id: u.idUsuario,
        username: u.nombreUsuario,
        role: u.rol === "ADMINISTRADOR" ? "admin" : "worker",
        status: u.estado === "ACTIVO" ? "active" : "inactive",
      }));
      setUsers(mapped);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      addToast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        severity: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  // Manejar inputs
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Validación
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (!formData.username.trim()) {
      errors.username = "El nombre de usuario es requerido";
      isValid = false;
    }

    if (!password) {
      errors.password = "La contraseña es requerida";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Crear usuario
  const handleAddUser = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        nombreUsuario: formData.username,
        nombreCompleto: formData.fullName,
        clave: password,
        rol: formData.role === "admin" ? "ADMINISTRADOR" : "TRABAJADOR",
      };

      await registrarUsuario(payload);

      addToast({
        title: "Usuario agregado",
        description: `${formData.username} ha sido agregado correctamente`,
        severity: "success",
      });

      setIsAddModalOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      addToast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo agregar el usuario",
        severity: "danger",
      });
    }
  };

  const handleToggleEstado = async () => {
    if (!currentUser) return;
    try {
      const nuevoEstado = currentUser.status === "active" ? "INACTIVO" : "ACTIVO";

      await cambiarEstadoUsuario(currentUser.id, nuevoEstado);

      await fetchUsers();

      setIsToggleModalOpen(false);

      addToast({
        title: "Estado actualizado",
        description: `El usuario ${currentUser.username} ahora está ${
          nuevoEstado === "ACTIVO" ? "Activo" : "Inactivo"
        }`,
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      addToast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        severity: "danger",
      });
    }
  };

  const openToggleStatusModal = (user: User) => {
    setCurrentUser(user);
    setIsToggleModalOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({ username: "", role: "worker", status: "active" });
    setPassword("");
    setConfirmPassword("");
    setFormErrors({});
    setCurrentUser(null);
  };

  // Filtrado
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || user.status === selectedStatus;
    const matchesRole =
      selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

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
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <Input
                placeholder="Buscar por usuario"
                value={searchTerm}
                onValueChange={setSearchTerm}
                startContent={<Icon icon="lucide:search" className="text-default-400" />}
                className="w-full sm:max-w-xs"
              />
              <div className="flex gap-2">
                <Select
                  placeholder="Estado"
                  selectedKeys={[selectedStatus]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setSelectedStatus(selected);
                  }}
                  className="w-full sm:w-32"
                >
                  <SelectItem key="all" value="all">Todos</SelectItem>
                  <SelectItem key="active" value="active">Activos</SelectItem>
                  <SelectItem key="inactive" value="inactive">Inactivos</SelectItem>
                </Select>
                <Select
                  placeholder="Rol"
                  selectedKeys={[selectedRole]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setSelectedRole(selected);
                  }}
                  className="w-full sm:w-40"
                >
                  <SelectItem key="all" value="all">Todos</SelectItem>
                  <SelectItem key="admin" value="admin">Administrador</SelectItem>
                  <SelectItem key="worker" value="worker">Trabajador</SelectItem>
                </Select>
              </div>
            </div>
            <Button
              color="primary"
              onPress={() => setIsAddModalOpen(true)}
              startContent={<Icon icon="lucide:plus" />}
            >
              Agregar Usuario
            </Button>
          </div>

          {/* Tabla */}
          <Table aria-label="Tabla de usuarios">
            <TableHeader>
              <TableColumn>USUARIO</TableColumn>
              <TableColumn>ROL</TableColumn>
              <TableColumn>ESTADO</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No se encontraron usuarios">
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Chip color={user.role === "admin" ? "secondary" : "primary"} size="sm" variant="flat">
                      {user.role === "admin" ? "Administrador" : "Trabajador"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip color={user.status === "active" ? "success" : "danger"} size="sm" variant="flat">
                      {user.status === "active" ? "Activo" : "Inactivo"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      color={user.status === "active" ? "danger" : "success"}
                      onPress={() => openToggleStatusModal(user)}
                    >
                      <Icon icon="lucide:refresh-ccw" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Modal Agregar Usuario */}
      <Modal isOpen={isAddModalOpen} onOpenChange={setIsAddModalOpen} onClose={resetForm}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Agregar Usuario</ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre de Usuario"
                    value={formData.username}
                    onValueChange={(value) => handleInputChange("username", value)}
                    isInvalid={!!formErrors.username}
                    errorMessage={formErrors.username}
                    isRequired
                  />
                  <Input
                    label="Nombre Completo"
                    value={formData.fullName}
                    onValueChange={(value) => handleInputChange("fullName", value)}
                    isRequired
                  />
                  <Select
                    label="Rol"
                    selectedKeys={[formData.role]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as "admin" | "worker";
                      handleInputChange("role", selected);
                    }}
                    isRequired
                  >
                    <SelectItem key="admin">Administrador</SelectItem>
                    <SelectItem key="worker">Trabajador</SelectItem>
                  </Select>
                  <Input
                    type="password"
                    label="Contraseña"
                    value={password}
                    onValueChange={setPassword}
                    isInvalid={!!formErrors.password}
                    errorMessage={formErrors.password}
                    isRequired
                  />
                  <Input
                    type="password"
                    label="Confirmar Contraseña"
                    value={confirmPassword}
                    onValueChange={setConfirmPassword}
                    isInvalid={!!formErrors.confirmPassword}
                    errorMessage={formErrors.confirmPassword}
                    isRequired
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancelar</Button>
                <Button color="primary" onPress={handleAddUser}>Agregar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal Cambiar Estado */}
      <Modal isOpen={isToggleModalOpen} onOpenChange={setIsToggleModalOpen} onClose={resetForm}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Cambiar Estado</ModalHeader>
              <ModalBody>
                <p>
                  ¿Seguro que deseas cambiar el estado del usuario{" "}
                  <span className="font-semibold">{currentUser?.username}</span>{" "}
                  a {currentUser?.status === "active" ? "Inactivo" : "Activo"}?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>Cancelar</Button>
                <Button
                  color={currentUser?.status === "active" ? "danger" : "success"}
                  onPress={handleToggleEstado}
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

export default UserManagement;