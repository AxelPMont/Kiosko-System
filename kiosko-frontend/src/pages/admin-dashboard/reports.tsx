import React from "react";
import { 
  Card, CardBody, CardHeader, Button, Input, Divider, Spinner
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell
} from "recharts";
import { getReportes } from "../../services/api";

const COLORS = ["#0096ff", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const Reports: React.FC = () => {
  const [startDate, setStartDate] = React.useState(() => new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = React.useState(() => new Date().toISOString().split("T")[0]);

  const [salesByDayData, setSalesByDayData] = React.useState<{ date: string; sales: number }[]>([]);
  const [topProductsData, setTopProductsData] = React.useState<{ name: string; sales: number }[]>([]);
  const [salesByCategoryData, setSalesByCategoryData] = React.useState<{ name: string; value: number }[]>([]);

  const [totalSales, setTotalSales] = React.useState(0);
  const [totalTransactions, setTotalTransactions] = React.useState(0);
  const [ticketPromedio, setTicketPromedio] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  
  const handleDateFilter = async () => {
      try {
        setLoading(true);
        const res = await getReportes(startDate, endDate);
        const data = res.data;

        // Adaptar datos del backend al formato que usa Recharts
        setSalesByDayData(
          data.ventasPorDia.map((v: any) => ({
            date: v.fecha,
            sales: v.total,
          }))
        );

        setTopProductsData(
          data.topProductos.map((p: any) => ({
            name: p.nombreProducto,
            sales: p.cantidadVendida,
          }))
        );

        setSalesByCategoryData(
          data.ventasPorCategoria.map((c: any) => ({
            name: c.nombreCategoria,
            value: c.porcentaje,
          }))
        );

        setTotalSales(data.totalVentas);
        setTotalTransactions(data.totalTransacciones);
        setTicketPromedio(data.ticketPromedio);

      } catch (err) {
        console.error("Error cargando reportes:", err);
      } finally {
        setLoading(false);
      }
    };

    React.useEffect(() => {
      handleDateFilter();
    }, []);

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', { month: 'short', day: 'numeric' }).format(date);
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center h-[80vh]">
          <Spinner color="primary" label="Cargando reportes..." />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <h3 className="text-lg font-medium">Reportes de Ventas</h3>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Input
                type="date"
                label="Fecha Inicio"
                placeholder="Fecha inicio"
                value={startDate}
                onValueChange={setStartDate}
                className="w-full sm:w-auto"
              />

              <Input
                type="date"
                label="Fecha Fin"
                placeholder="Fecha fin"
                value={endDate}
                onValueChange={setEndDate}
                className="w-full sm:w-auto"
              />

              <Button
                color="primary"
                onPress={handleDateFilter}
                className="self-end"
              >
                Filtrar
              </Button>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            {/* --- MÉTRICAS SUPERIORES --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardBody>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary-100 rounded-medium">
                      <Icon icon="lucide:dollar-sign" className="text-primary text-2xl" />
                    </div>
                    <div>
                      <p className="text-small text-default-500">Ventas Totales</p>
                      <p className="text-xl font-semibold">S/ {totalSales.toFixed(2)}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-success-100 rounded-medium">
                      <Icon icon="lucide:shopping-cart" className="text-success text-2xl" />
                    </div>
                    <div>
                      <p className="text-small text-default-500">Transacciones</p>
                      <p className="text-xl font-semibold">{totalTransactions}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-warning-100 rounded-medium">
                      <Icon icon="lucide:trending-up" className="text-warning text-2xl" />
                    </div>
                    <div>
                      <p className="text-small text-default-500">Ticket Promedio</p>
                      <p className="text-xl font-semibold">S/ {ticketPromedio.toFixed(2)}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* --- GRÁFICOS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Ventas por día */}
              <Card>
                <CardHeader>
                  <h3 className="text-md font-medium">Ventas por Día</h3>
                </CardHeader>
                <CardBody>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesByDayData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={formatDate} />
                        <YAxis />
                        <Tooltip formatter={(value) => [`S/ ${value}`, "Ventas"]} />
                        <Legend />
                        <Line type="monotone" dataKey="sales" name="Ventas" stroke="#0096ff" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>

              {/* Top productos */}
              <Card>
                <CardHeader>
                  <h3 className="text-md font-medium">Top 5 Productos Más Vendidos</h3>
                </CardHeader>
                <CardBody>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topProductsData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip formatter={(value) => [`${value} unidades`, "Ventas"]} />
                        <Bar dataKey="sales" name="Unidades Vendidas" fill="#0096ff" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>

              {/* Ventas por categoría */}
              <Card>
                <CardHeader>
                  <h3 className="text-md font-medium">Ventas por Categoría</h3>
                </CardHeader>
                <CardBody>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={salesByCategoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {salesByCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`S/ ${value}`, "Total"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                    {/*
                    <Card>
                      <CardHeader>
                        <h3 className="text-md font-medium">Resumen de Ventas</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="space-y-4">
                          <div className="bg-default-50 p-4 rounded-medium">
                            <h4 className="font-medium mb-2">Detalles del Periodo</h4>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-small text-default-500">Fecha Inicio:</p>
                                <p className="font-medium">{formatDate(startDate)}</p>
                              </div>
                              <div>
                                <p className="text-small text-default-500">Fecha Fin:</p>
                                <p className="font-medium">{formatDate(endDate)}</p>
                              </div>
                              <div>
                                <p className="text-small text-default-500">Total Días:</p>
                                <p className="font-medium">{sales.length}</p>
                              </div>
                              <div>
                                <p className="text-small text-default-500">Promedio Diario:</p>
                                <p className="font-medium">
                                  ${sales.length > 0
                                    ? (totalSales / sales.length).toFixed(2)
                                    : "0.00"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Análisis de Ventas</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-default-500">Día con más ventas:</span>
                                <span className="font-medium">
                                  {sales.length > 0
                                    ? formatDate(sales.reduce((max, item) =>
                                        max.total > item.total ? max : item
                                      ).fechaHora.split('T')[0])
                                    : "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-default-500">Día con menos ventas:</span>
                                <span className="font-medium">
                                  {sales.length > 0
                                    ? formatDate(sales.reduce((min, item) =>
                                        min.total < item.total ? min : item
                                      ).fechaHora.split('T')[0])
                                    : "N/A"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-default-500">Producto más vendido:</span>
                                <span className="font-medium">{topProductsData[0]?.name || "N/A"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-default-500">Categoría más vendida:</span>
                                <span className="font-medium">{salesByCategoryData[0]?.name || "N/A"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2">
                            <Button
                              color="primary"
                              fullWidth
                              startContent={<Icon icon="lucide:download" />}
                            >
                              Exportar Reporte
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                    */}
                  </div>
                </CardBody>
              </Card>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  };

  export default Reports;