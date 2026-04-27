import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Ticket {
  id: string;
  observaciones: {
    estado: "pendiente" | "en observación" | "aplica" | "en proceso" | "en espera aceptación" | "terminado" | "no aplica";
  }[];
}

interface TicketsChartProps {
  tickets: Ticket[];
}

const COLORS = {
  pendiente: "#f59e0b",
  "en proceso": "#3b82f6",
  "en ejecución": "#3b82f6",
  cerrados: "#10b981",
};

export function TicketsChart({ tickets }: TicketsChartProps) {
  // Calcular estado del ticket basado en observaciones
  const getTicketEstado = (ticket: Ticket) => {
    const estados = ticket.observaciones.map(obs => obs.estado);
    if (estados.every(e => e === "terminado")) return "terminado";
    if (estados.some(e => e === "en proceso")) return "en proceso";
    if (estados.some(e => e === "pendiente")) return "pendiente";
    return "en revisión";
  };

  // Agrupar tickets por estado
  const pendientes = tickets.filter(t => getTicketEstado(t) === "pendiente").length;
  const enProceso = tickets.filter(t => getTicketEstado(t) === "en proceso").length;
  const cerrados = tickets.filter(t => getTicketEstado(t) === "terminado").length;

  const data = [
    { id: "pendiente", name: "Abiertos", value: pendientes, color: COLORS.pendiente },
    { id: "en-proceso", name: "En Proceso", value: enProceso, color: COLORS["en proceso"] },
    { id: "cerrados", name: "Cerrados", value: cerrados, color: COLORS.cerrados },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de Tickets</CardTitle>
        <CardDescription>Distribución por estado actual</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} key="tickets-chart">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} id="tickets-bar">
              {data.map((entry) => (
                <Cell key={entry.id} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
