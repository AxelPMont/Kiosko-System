import React from "react";
import { Switch, Route, useRouteMatch, useLocation } from "react-router-dom";
import Sidebar from "../../components/layout/sidebar";
import Header from "../../components/layout/header";
import OpenRegister from "./open-register";
import Sales from "./sales";

const WorkerDashboard: React.FC = () => {
  const { path } = useRouteMatch();
  const location = useLocation();
  const [pageTitle, setPageTitle] = React.useState("Apertura de Caja");

  React.useEffect(() => {
    const pathname = window.location.pathname;
    
    if (pathname.includes("/open-register") || pathname === path) {
      setPageTitle("Apertura de Caja");
    } else if (pathname.includes("/sales")) {
      setPageTitle("Registro de Ventas");
    } else {
      setPageTitle("Apertura de Caja");
    }
  }, [location.pathname, path]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar role="worker" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageTitle} />
        
        <main className="flex-1 overflow-y-auto p-4">
          <Switch>
            <Route exact path={path}>
              <OpenRegister />
            </Route>
            <Route path={`${path}/open-register`}>
              <OpenRegister />
            </Route>
            <Route path={`${path}/sales`}>
              <Sales />
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  );
};

export default WorkerDashboard;