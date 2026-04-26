import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Ticket {
  id: string;
  observaciones: {
    falla: string;
    estado?: string;
    urgencia?: string;
    categoria?: string;
  }[];
}

interface CommonFaultsChartProps {
  tickets: Ticket[];
}

export function CommonFaultsChart({ tickets }: CommonFaultsChartProps) {
  // Contar fallas
  const faultsMap = new Map<string, number>();

  tickets.forEach(ticket => {
    ticket.observaciones.forEach(obs => {
      const falla = obs.falla;
      faultsMap.set(falla, (faultsMap.get(falla) || 0) + 1);
    });
  });

  // Convertir a array y ordenar por cantidad
  const data = Array.from(faultsMap.entries())
    .map(([name, count]) => ({ id: name.replace(/\s+/g, '-').toLowerCase(), name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 fallas

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fallas Más Comunes</CardTitle>
        <CardDescription>Top 5 observaciones reportadas</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" key="faults-chart">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" className="text-xs" />
            <YAxis
              dataKey="name"
              type="category"
              width={200}
              className="text-xs"
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
            <Bar dataKey="count" fill="#ED1C25" radius={[0, 8, 8, 0]} id="faults-bar" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
