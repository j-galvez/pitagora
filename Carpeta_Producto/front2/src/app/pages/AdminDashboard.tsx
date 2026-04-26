import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  FileText,
  PlusCircle,
  MessageSquare,
  LogOut,
  BarChart3,
  AlertCircle,
  Clock,
  CheckCircle,
  Search
} from "lucide-react";
import { TicketsChart } from "../components/admin/TicketsChart";
import { CommonFaultsChart } from "../components/admin/CommonFaultsChart";
import { TicketCard } from "../components/TicketCard";
import { AdminTicketDetails } from "../components/admin/AdminTicketDetails";

// Mock data - en producción vendría de la API
const mockTickets = [
  {
    id: "001",
    obra: "Edificio Los Almendros - Depto 305",
    descripcionObra: "Departamento ubicado en tercer piso con vista al norte",
    fecha: "15/04/2026",
    observaciones: [
      {
        id: "obs-1",
        falla: "Grieta en muro del dormitorio principal",
        ubicacion: "Dormitorio principal, muro norte",
        descripcion: "Se observa grieta vertical de aproximadamente 30cm en el muro del dormitorio principal.",
        fotos: ["https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400"],
        estado: "en proceso" as const,
        urgencia: "alta" as const,
        categoria: "terminaciones muros" as const,
        mensajes: [
          {
            id: "msg-1",
            texto: "Hemos programado la reparación para el 20/04/2026. El equipo de albañilería realizará la reparación.",
            fecha: "16/04/2026",
            autor: "Admin"
          }
        ],
      },
      {
        id: "obs-2",
        falla: "Filtración en baño principal",
        ubicacion: "Baño principal, sector de ducha",
        descripcion: "Hay una filtración constante en la ducha que afecta el piso inferior.",
        fotos: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400"],
        estado: "pendiente" as const,
        urgencia: "alta" as const,
        categoria: "sanitario" as const,
        mensajes: [],
      }
    ],
  },
  {
    id: "002",
    obra: "Casa Los Robles - Lote 12",
    descripcionObra: "Casa de 120m² en condominio Los Robles",
    fecha: "16/04/2026",
    observaciones: [
      {
        id: "obs-3",
        falla: "Puerta principal desnivelada",
        ubicacion: "Acceso principal",
        descripcion: "La puerta no cierra correctamente debido a desnivel del marco.",
        fotos: [],
        estado: "pendiente" as const,
        urgencia: "media" as const,
        categoria: "puertas y/o ventanas" as const,
        mensajes: [],
      }
    ],
  },
  {
    id: "003",
    obra: "Edificio Vista Mar - Depto 801",
    descripcionObra: "Departamento en piso 8 con vista al mar",
    fecha: "10/04/2026",
    observaciones: [
      {
        id: "obs-4",
        falla: "Grieta en muro living",
        ubicacion: "Living, muro poniente",
        descripcion: "Grieta reparada y pintada según especificaciones.",
        fotos: [],
        estado: "terminado" as const,
        urgencia: "baja" as const,
        categoria: "terminaciones muros" as const,
        mensajes: [
          {
            id: "msg-2",
            texto: "Trabajo completado y verificado. Puede revisar el resultado.",
            fecha: "14/04/2026",
            autor: "Admin"
          }
        ],
      }
    ],
  },
];

// Calcular estado del ticket basado en observaciones
const getTicketEstado = (ticket: typeof mockTickets[0]) => {
  const estados = ticket.observaciones.map(obs => obs.estado);
  if (estados.every(e => e === "terminado")) return "terminado";
  if (estados.some(e => e === "en proceso")) return "en proceso";
  if (estados.some(e => e === "pendiente")) return "pendiente";
  return "en revisión";
};

// Estadísticas calculadas basadas en observaciones
const stats = {
  pendiente: mockTickets.filter(t => getTicketEstado(t) === "pendiente").length,
  enProceso: mockTickets.filter(t => getTicketEstado(t) === "en proceso").length,
  cerrados: mockTickets.filter(t => getTicketEstado(t) === "terminado").length,
};

const totalObservaciones = mockTickets.reduce((total, ticket) => total + ticket.observaciones.length, 0);

export function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState(mockTickets[0]);
  const [activeSection, setActiveSection] = useState<"dashboard" | "tickets" | "messages">("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    navigate("/login");
  };

  const handleCreateTicket = () => {
    navigate("/admin/crear-ticket");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-72 bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <img
            src="https://www.pitagora.cl/images/logo_up_pitagora.gif"
            alt="Pitágora Logo"
            className="h-12"
          />
          <div className="mt-4">
            <p className="text-sm font-medium">Panel de Administración</p>
            <p className="text-xs text-sidebar-foreground/80 mt-1">Gestión de Postventa</p>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <Button
              variant={activeSection === "dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("dashboard")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeSection === "tickets" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("tickets")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Tickets
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start bg-accent text-accent-foreground hover:bg-accent/80"
              onClick={handleCreateTicket}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Crear Nuevo Ticket
            </Button>
            <Button
              variant={activeSection === "messages" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("messages")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Mis Mensajes
            </Button>
          </div>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {activeSection === "dashboard" ? (
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              <div>
                <h1 className="text-3xl">Panel de Control</h1>
                <p className="text-muted-foreground mt-1">Vista general del sistema de postventa</p>
              </div>

              {/* Cards de estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Tickets Abiertos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">{stats.pendiente}</p>
                        <p className="text-xs text-muted-foreground">Pendientes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>En Proceso</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">{stats.enProceso}</p>
                        <p className="text-xs text-muted-foreground">Activos</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Cerrados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">{stats.cerrados}</p>
                        <p className="text-xs text-muted-foreground">Completados</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Observaciones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <FileText className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">{totalObservaciones}</p>
                        <p className="text-xs text-muted-foreground">Registradas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TicketsChart tickets={mockTickets} />
                <CommonFaultsChart tickets={mockTickets} />
              </div>

              {/* Mensajes recientes */}
              <Card>
                <CardHeader>
                  <CardTitle>Mensajes Recientes</CardTitle>
                  <CardDescription>Últimas comunicaciones del sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Nuevo ticket creado - Edificio Los Almendros</p>
                        <p className="text-xs text-muted-foreground mt-1">Hace 2 horas</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Ticket #003 cerrado - Vista Mar</p>
                        <p className="text-xs text-muted-foreground mt-1">Hace 1 día</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        ) : activeSection === "tickets" ? (
          <div className="flex h-full">
            {/* Tickets List */}
            <div className="w-96 border-r overflow-hidden flex flex-col">
              <div className="p-6 border-b space-y-4">
                <div>
                  <h2>Todos los Tickets</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {mockTickets.length} {mockTickets.length === 1 ? 'ticket' : 'tickets'} • {totalObservaciones} {totalObservaciones === 1 ? 'observación' : 'observaciones'}
                  </p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por falla, ubicación..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  {mockTickets
                    .filter(ticket => {
                      if (!searchTerm) return true;
                      const term = searchTerm.toLowerCase();
                      return ticket.observaciones.some(obs =>
                        obs.falla.toLowerCase().includes(term) ||
                        obs.ubicacion.toLowerCase().includes(term) ||
                        obs.descripcion.toLowerCase().includes(term)
                      );
                    })
                    .map((ticket) => (
                      <TicketCard
                        key={ticket.id}
                        ticket={{ ...ticket, estado: getTicketEstado(ticket) }}
                        onClick={() => setSelectedTicket(ticket)}
                      />
                    ))}
                </div>
              </ScrollArea>
            </div>

            {/* Ticket Details */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6">
                  {selectedTicket ? (
                    <AdminTicketDetails ticket={{ ...selectedTicket, estado: getTicketEstado(selectedTicket) }} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Selecciona un ticket para ver los detalles
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="p-6">
              <h2 className="text-2xl mb-6">Mis Mensajes</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-center">No hay mensajes nuevos</p>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        )}
      </main>
    </div>
  );
}
