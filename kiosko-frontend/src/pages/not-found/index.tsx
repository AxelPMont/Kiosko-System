import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Icon icon="lucide:alert-triangle" className="text-warning text-6xl" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Página no encontrada</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Button
          as={Link}
          to="/"
          color="primary"
          startContent={<Icon icon="lucide:home" />}
        >
          Volver al inicio
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;