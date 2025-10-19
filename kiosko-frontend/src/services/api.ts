import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Servicios
export const loginService = (nombreUsuario: string, clave: string) => {
  return api.post("/auth/login", { nombreUsuario, clave });
};

// Caja
export const abrirCaja = (data: any) => api.post("/caja/abrir", data);

// Venta
export const registrarVenta = (data) => api.post("/venta/registrar", data);
export const listarVentas = (soloCompletadas = false) => api.get("/venta", { params: { soloCompletadas } });

// Dashboard
export const getDashboardResumen = () => api.get("/dashboard/resumen");
export const getVentasSemana = () => api.get("/dashboard/ventas-semana");
export const getActividadesRecientes = () => api.get("/dashboard/actividades-recientes");

// Productos
export const getProductos = () => api.get("/producto");
export const crearProducto = (data: any) => api.post("/producto", data);
export const actualizarProducto = (id: number, data: any) => api.put(`/producto/${id}`, data);
export const eliminarProducto = (id: number) => api.delete(`/producto/${id}`);
export const getProductosPorCategoria = () => api.get("/producto/resumen-categorias");
export const getProductosBajoStock = () => api.get("/producto/bajo-stock");

// Categorias
export const getCategoria = () => api.get("/categoria-producto");

// Usuarios
export const getUsuarios = () => api.get(`/usuario`);
export const registrarUsuario = (data: any) => api.post("/usuario", data);
export const cambiarEstadoUsuario = (id: number, estado: "ACTIVO" | "INACTIVO") => api.patch(`/usuario/${id}/estado?estado=${estado}`);

// Reportes
export const getReportes = (inicio: string, fin: string) => api.get(`/reportes/ventas?inicio=${inicio}&fin=${fin}`);

export default api;