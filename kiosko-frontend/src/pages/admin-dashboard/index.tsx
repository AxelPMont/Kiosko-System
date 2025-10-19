import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import Sidebar from "../../components/layout/sidebar";
import Header from "../../components/layout/header";
import AdminHome from "./admin-home";
import ProductManagement from "./product-management";
import UserManagement from "./user-management";
import Reports from "./reports";

const AdminDashboard: React.FC = () => {
  const { path } = useRouteMatch();
  const [pageTitle, setPageTitle] = React.useState("Dashboard");

  React.useEffect(() => {
    const pathname = window.location.pathname;
    
    if (pathname.includes("/products")) {
      setPageTitle("Gestión de Productos");
    } else if (pathname.includes("/users")) {
      setPageTitle("Gestión de Usuarios");
    } else if (pathname.includes("/reports")) {
      setPageTitle("Reportes");
    } else {
      setPageTitle("Dashboard");
    }
  }, [window.location.pathname]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="admin" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageTitle} />
        
        <main className="flex-1 overflow-y-auto p-4">
          <Switch>
            <Route exact path={path}>
              <AdminHome />
            </Route>
            <Route path={`${path}/products`}>
              <ProductManagement />
            </Route>
            <Route path={`${path}/users`}>
              <UserManagement />
            </Route>
            <Route path={`${path}/reports`}>
              <Reports />
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;