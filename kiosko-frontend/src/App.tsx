import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { useAuth } from "./contexts/auth-context";
import LoginPage from "./pages/login";
import WorkerDashboard from "./pages/worker-dashboard";
import AdminDashboard from "./pages/admin-dashboard";
import NotFoundPage from "./pages/not-found";
import { Spinner } from "@heroui/react";

const App: React.FC = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <Switch>
      <Route exact path="/login">
        {isAuthenticated ? (
          user?.role === "admin" ? (
            <Redirect to="/admin" />
          ) : (
            <Redirect to="/worker" />
          )
        ) : (
          <LoginPage />
        )}
      </Route>

      <Route path="/worker">
        {isAuthenticated ? (
          user?.role === "worker" ? (
            <WorkerDashboard />
          ) : (
            <Redirect to="/login" />
          )
        ) : (
          <Redirect to="/login" />
        )}
      </Route>

      <Route path="/admin">
        {isAuthenticated ? (
          user?.role === "admin" ? (
            <AdminDashboard />
          ) : (
            <Redirect to="/login" />
          )
        ) : (
          <Redirect to="/login" />
        )}
      </Route>

      <Route exact path="/">
        {!isAuthenticated ? (
          <Redirect to="/login" />
        ) : user?.role === "admin" ? (
          <Redirect to="/admin" />
        ) : (
          <Redirect to="/worker" />
        )}
      </Route>

      {/* Not Found */}
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default App;