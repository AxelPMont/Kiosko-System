import React from "react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  User,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../../contexts/auth-context";
import logo from "../../assets/logo-sd.png";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user, logout } = useAuth();

  return (
    <Navbar maxWidth="full" className="border-b border-divider bg-white shadow-sm px-4">
      <NavbarContent>
        <h1 className="text-lg font-medium text-gray-800">{title}</h1>
      </NavbarContent>

      <NavbarContent justify="end">
        {user && (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <User
                name={user.fullName || user.username || "Usuario"}
                description={user.role === "admin" ? "Administrador" : "Trabajador"}
                avatarProps={{
                  src: logo,
                  className: "w-8 h-8 cursor-pointer",
                }}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Menú de usuario">
              <DropdownItem key="profile" startContent={<Icon icon="lucide:user" />}>
                Perfil
              </DropdownItem>
              <DropdownItem
                key="logout"
                startContent={<Icon icon="lucide:log-out" />}
                color="danger"
                onPress={logout}
              >
                Cerrar sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Header;