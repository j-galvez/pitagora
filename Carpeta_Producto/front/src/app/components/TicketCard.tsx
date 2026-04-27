import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Clock, MapPin, AlertCircle } from "lucide-react";

export type TicketStatus =
  | "pendiente"
  | "en proceso"
  | "en ejecucion"
  | "no aplica"
  | "en aceptacion"
  | "terminado"
  | "en revisión";

interface Observation {
  id: string;
  falla: string;
  ubicacion: string;
  descripcion: string;
  fotos: string[];
  video?: string;
}

interface Ticket {
  id: string;
  obra: string;
  descripcionObra: string;
  estado: TicketStatus;
  fecha: string;
  observaciones: Observation[];
}

interface TicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
}

const statusConfig: Record<TicketStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  "pendiente": { label: "Pendiente", variant: "outline" },
  "en proceso": { label: "En Proceso", variant: "secondary" },
  "en ejecucion": { label: "En Ejecución", variant: "default" },
  "no aplica": { label: "No Aplica", variant: "destructive" },
  "en aceptacion": { label: "En Aceptación", variant: "secondary" },
  "terminado": { label: "Terminado", variant: "default" },
  "en revisión": { label: "En Revisión", variant: "secondary" },
};

export function TicketCard({ ticket, onClick }: TicketCardProps) {
  const config = statusConfig[ticket.estado] || { label: ticket.estado || "En Revisión", variant: "secondary" as const };

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">Ticket #{ticket.id}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{ticket.obra}</p>
          </div>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm">{ticket.descripcionObra}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{ticket.fecha}</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>{ticket.observaciones.length} observaciones</span>
            </div>
          </div>
          {ticket.observaciones.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-xs font-medium mb-2">Última observación:</p>
              <div className="space-y-1">
                <p className="text-sm">{ticket.observaciones[ticket.observaciones.length - 1].falla}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{ticket.observaciones[ticket.observaciones.length - 1].ubicacion}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
