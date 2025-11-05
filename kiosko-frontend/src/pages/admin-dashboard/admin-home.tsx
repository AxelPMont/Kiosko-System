import React from "react";
import { Card, CardBody, CardHeader, Button, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts";
import { getDashboardResumen, getVentasSemana, getProductosPorCategoria, getProductosBajoStock, getActividadesRecientes } from "../../services/api";

dayjs.extend(relativeTime);
dayjs.locale("es");

interface DashboardResumenDTO {
  ventasHoy: number;
  variacionVsAyer: number;
  totalProductos: number;
  productosBajoStock: number;
  totalUsuarios: number;
  administradores: number;
  alertas: number;
}

const AdminHome: React.FC = () => {
    const [resumen, setResumen] = React.useState<DashboardResumenDTO | null>(null);
    const [ventasSemana, setVentasSemana] = React.useState<{ name: string; sales: number }[]>([]);
    const [productData, setProductData] = React.useState([]);
    const [productosBajoStock, setProductosBajoStock] = React.useState([]);
    const [actividades, setActividades] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchResumen = async () => {
          try {
            const res = await getDashboardResumen();
            setResumen(res.data);
          } catch (err) {
            console.error("Error cargando resumen:", err);
          } finally {
            setLoading(false);
          }
        };
        fetchResumen();

        const fetchVentas = async () => {
            try {
              const res = await getVentasSemana();
              const data = res.data.map((v: any) => {
                const [y, m, d] = (v.fecha as string).split("-");
                const fechaLocal = new Date(Number(y), Number(m) - 1, Number(d)); // local midnight
                const dia = fechaLocal.toLocaleDateString("es-ES", { weekday: "short" }); // "vie"
                const label = dia.charAt(0).toUpperCase() + dia.slice(1); // "Vie"
                return { name: label, sales: Number(v.total) };
              });
              setVentasSemana(data);
            } catch (err) {
              console.error("Error cargando ventas semana:", err);
            }
          };
          fetchVentas();

          const fetchProductosPorCategoria = async () => {
              try {
                const res = await getProductosPorCategoria();
                const data = res.data.map((item: any) => ({
                  name: item.nombreCategoria,
                  count: item.cantidadProductos
                }));
                setProductData(data);
              } catch (error) {
                console.error("Error cargando productos por categoría:", error);
              }
            };
          fetchProductosPorCategoria();

          const fetchProductosBajoStock = async () => {
            try {
              const res = await getProductosBajoStock();
              setProductosBajoStock(res.data);
            } catch (error) {
              console.error("Error cargando productos con bajo stock:", error);
            }
          };
          fetchProductosBajoStock();

          const fetchActividades = async () => {
            try {
              const res = await getActividadesRecientes();
              setActividades(res.data);
            } catch (err) {
              console.error("Error cargando actividades:", err);
            }
          };
          fetchActividades();
      }, []);

    if (loading) {
        return (
          <div className="flex items-center justify-center h-[80vh]">
            <Spinner color="primary" label="Cargando resumen..." />
          </div>
        );
    }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary-100 rounded-medium">
                <Icon icon="lucide:shopping-cart" className="text-primary text-2xl" />
              </div>
              <div>
                <p className="text-small text-default-500">Ventas Hoy</p>
                <p className="text-xl font-semibold">
                  {resumen ? `S/ ${resumen.ventasHoy.toFixed(2)}` : "$0.00"}
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center text-success text-small">
              <Icon icon="lucide:trending-up" />
              <span className="ml-1">
                {resumen ? `${resumen.variacionVsAyer >= 0 ? "+" : ""}${resumen.variacionVsAyer.toFixed(1)}% vs ayer` : "—"}
              </span>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-success-100 rounded-medium">
                <Icon icon="lucide:package" className="text-success text-2xl" />
              </div>
              <div>
                <p className="text-small text-default-500">Productos</p>
                <p className="text-xl font-semibold">
                  {resumen ? resumen.totalProductos : 0}
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center text-warning text-small">
              <Icon icon="lucide:alert-triangle" />
              <span className="ml-1">
                {resumen ? `${resumen.productosBajoStock} con bajo stock` : "—"}
              </span>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-warning-100 rounded-medium">
                <Icon icon="lucide:users" className="text-warning text-2xl" />
              </div>
              <div>
                <p className="text-small text-default-500">Usuarios</p>
                <p className="text-xl font-semibold">
                  {resumen ? resumen.totalUsuarios : 0}
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center text-default-500 text-small">
              <Icon icon="lucide:user-check" />
              <span className="ml-1">
                {resumen ? `${resumen.administradores} administradores` : "—"}
              </span>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-danger-100 rounded-medium">
                <Icon icon="lucide:alert-circle" className="text-danger text-2xl" />
              </div>
              <div>
                <p className="text-small text-default-500">Alertas</p>
                <p className="text-xl font-semibold">
                  {resumen ? resumen.alertas : 0}
                </p>
              </div>
            </div>
            <div className="mt-2 flex items-center text-danger text-small">
              <Icon icon="lucide:bell" />
              <span className="ml-1">Requieren atención</span>
            </div>
          </CardBody>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex justify-between">
            <h3 className="text-lg font-medium">Ventas de la Semana</h3>
            <Button
              as={Link}
              to="/admin/reports"
              variant="flat"
              color="primary"
              size="sm"
              endContent={<Icon icon="lucide:arrow-right" />}
            >
              Ver Reportes
            </Button>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={ventasSemana}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`S/ ${value}`, 'Ventas']}
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    name="Ventas" 
                    stroke="#0096ff" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6, stroke: '#0096ff', strokeWidth: 2, fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader className="flex justify-between">
            <h3 className="text-lg font-medium">Productos por Categoría</h3>
            <Button
              as={Link}
              to="/admin/products"
              variant="flat"
              color="primary"
              size="sm"
              endContent={<Icon icon="lucide:arrow-right" />}
            >
              Ver Productos
            </Button>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip 
                    formatter={(value) => [`${value}`, 'Productos']}
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    name="Productos" 
                    fill="#0096ff" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex justify-between">
            <h3 className="text-lg font-medium">Productos con Bajo Stock</h3>
            <Button
              as={Link}
              to="/admin/products"
              variant="flat"
              color="primary"
              size="sm"
            >
              Gestionar
            </Button>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {productosBajoStock.length > 0 ? (
                productosBajoStock.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.nombreProducto}</p>
                      <p className="text-small text-danger">
                        Stock: {item.stockActual} / Mínimo: {item.stockMinimo}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      startContent={<Icon icon="lucide:plus" />}
                    >
                      Reponer
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-default-500 text-small">No hay productos con bajo stock 🎉</p>
              )}
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader className="flex justify-between">
            <h3 className="text-lg font-medium">Últimas Actividades</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {actividades.length > 0 ? (
                actividades.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-default-100 rounded-full">
                      <Icon icon={item.icono || "lucide:activity"} className="text-default-500" />
                    </div>
                    <div>
                      <p>
                        <span className="font-medium">{item.usuario}</span>{" "}
                        {item.accion}
                      </p>
                      <p className="text-small text-default-500">
                        {dayjs(item.fecha).fromNow()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-default-500 text-small">No hay actividades recientes</p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;