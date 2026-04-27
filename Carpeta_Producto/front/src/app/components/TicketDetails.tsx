import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MapPin, FileText, Image as ImageIcon, Video, MessageSquare } from "lucide-react";
import type { TicketStatus } from "./TicketCard";

type ObservacionEstado = "pendiente" | "en observación" | "aplica" | "en proceso" | "en espera aceptación" | "terminado" | "no aplica";

interface Message {
  id: string;
  texto: string;
  fecha: string;
  autor: string;
}

interface Observation {
  id: string;
  falla: string;
  ubicacion: string;
  descripcion: string;
  fotos: string[];
  video?: string;
  estado: ObservacionEstado;
  urgencia: "alta" | "media" | "baja";
  categoria: string;
  mensajes?: Message[];
}

interface Ticket {
  id: string;
  obra: string;
  descripcionObra: string;
  estado: TicketStatus;
  fecha: string;
  observaciones: Observation[];
}

interface TicketDetailsProps {
  ticket: Ticket;
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

const observacionStatusConfig: Record<ObservacionEstado, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  "pendiente": { label: "Pendiente", variant: "outline" },
  "en observación": { label: "En Observación", variant: "secondary" },
  "aplica": { label: "Aplica", variant: "default" },
  "en proceso": { label: "En Proceso", variant: "secondary" },
  "en espera aceptación": { label: "En Espera Aceptación", variant: "secondary" },
  "terminado": { label: "Terminado", variant: "default" },
  "no aplica": { label: "No Aplica", variant: "destructive" },
};

const urgenciaConfig = {
  "alta": { label: "Alta", className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" },
  "media": { label: "Media", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" },
  "baja": { label: "Baja", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" },
};

export function TicketDetails({ ticket }: TicketDetailsProps) {
  const config = statusConfig[ticket.estado] || { label: ticket.estado || "En Revisión", variant: "secondary" as const };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Ticket #{ticket.id}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{ticket.fecha}</p>
            </div>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">Obra</p>
            <p className="text-sm text-muted-foreground">{ticket.obra}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Descripción de la Obra</p>
            <p className="text-sm text-muted-foreground">{ticket.descripcionObra}</p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="mb-4">Observaciones ({ticket.observaciones.length})</h3>
        <div className="space-y-4">
          {ticket.observaciones.map((obs, index) => {
            const obsConfig = observacionStatusConfig[obs.estado] || { label: obs.estado || "Pendiente", variant: "outline" as const };
            const urgConfig = urgenciaConfig[obs.urgencia] || { label: obs.urgencia || "Media", className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400" };

            return (
              <Card key={obs.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">Observación #{index + 1}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant={obsConfig.variant}>{obsConfig.label}</Badge>
                      <Badge className={urgConfig.className}>{urgConfig.label}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">Falla</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{obs.falla}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">Ubicación</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{obs.ubicacion}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Categoría</p>
                    <p className="text-sm text-muted-foreground capitalize">{obs.categoria}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Descripción Detallada</p>
                    <p className="text-sm text-muted-foreground">{obs.descripcion}</p>
                  </div>
                {obs.fotos.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">Fotos ({obs.fotos.length})</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {obs.fotos.map((foto, idx) => (
                        <div key={idx} className="aspect-video bg-muted rounded-lg overflow-hidden">
                          <img src={foto} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {obs.video && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">Video</p>
                    </div>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <video src={obs.video} controls className="w-full h-full" />
                    </div>
                  </div>
                )}
                {obs.mensajes && obs.mensajes.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">Mensajes del equipo ({obs.mensajes.length})</p>
                    </div>
                    <div className="space-y-2">
                      {obs.mensajes.map((msg) => (
                        <div key={msg.id} className="bg-muted p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium">{msg.autor}</p>
                            <p className="text-xs text-muted-foreground">{msg.fecha}</p>
                          </div>
                          <p className="text-sm">{msg.texto}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
