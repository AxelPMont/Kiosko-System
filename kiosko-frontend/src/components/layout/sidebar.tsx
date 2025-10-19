import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../../contexts/auth-context";

interface SidebarProps {
  role: "admin" | "worker";
}

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const workerNavItems: NavItem[] = [
    { label: "Apertura de Caja", icon: "lucide:box", path: "/worker/open-register" },
    { label: "Ventas", icon: "lucide:shopping-cart", path: "/worker/sales" },
    { label: "Cierre de Caja", icon: "lucide:clipboard-check", path: "/worker/close-register" },
  ];
  
  const adminNavItems: NavItem[] = [
    { label: "Dashboard", icon: "lucide:layout-dashboard", path: "/admin" },
    { label: "Productos", icon: "lucide:package", path: "/admin/products" },
    { label: "Usuarios", icon: "lucide:users", path: "/admin/users" },
    { label: "Reportes", icon: "lucide:bar-chart-2", path: "/admin/reports" },
  ];
  
  const navItems = role === "admin" ? adminNavItems : workerNavItems;
  
  const isActive = (path: string) => {
    const { pathname } = location;

    if (role === "admin") {
      if (path === "/admin" && pathname === "/admin") return true;
      if (path !== "/admin" && pathname.startsWith(path)) return true;
    } else if (role === "worker") {
      if (pathname === "/worker" && path === "/worker/open-register") return true; // activa "Apertura de Caja" en la raíz
      if (pathname.startsWith(path)) return true;
    }

    return false;
  };

  return (
    <div className="w-64 h-screen bg-content1 border-r border-divider flex flex-col">
      <div className="p-4 flex items-center gap-2">
        <div className="bg-primary-500 p-2 rounded-medium">
          <Icon icon="lucide:shopping-cart" className="text-white text-xl" />
        </div>
        <h1 className="text-xl font-semibold">POS Kiosko</h1>
      </div>
      
      <Divider />
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              as={Link}
              to={item.path}
              variant={isActive(item.path) ? "solid" : "flat"}
              color={isActive(item.path) ? "primary" : "default"}
              className="w-full justify-start"
              startContent={<Icon icon={item.icon} />}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-divider">
        <Button
          variant="flat"
          color="danger"
          className="w-full justify-start"
          startContent={<Icon icon="lucide:log-out" />}
          onPress={logout}
        >
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;