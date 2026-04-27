import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";
import { TicketCard } from "../components/TicketCard";
import { TicketDetails } from "../components/TicketDetails";
import { ticketService } from "../services/api";
import {
  FileText,
  PlusCircle,
  MessageSquare,
  LogOut,
  User,
  Building2,
  Search,
  Loader2
} from "lucide-react";

const mockUser = {
  nombre: "Juan Pérez",
  email: "juan.perez@ejemplo.com",
  obra: "Edificio Los Almendros - Depto 305",
};

export function Dashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<"tickets" | "messages">("tickets");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchTickets() {
      try {
        setLoading(true);
        const data = await ticketService.getTicketsByObra(1); // Usando obra ID 1
        setTickets(data);
        if (data.length > 0) setSelectedTicket(data[0]);
      } catch (error) {
        console.error("Error al cargar tickets:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  const totalObservaciones = tickets.reduce((total, ticket) => total + (ticket.observaciones?.length || 0), 0);

  const getTicketEstado = (ticket: any) => {
    if (!ticket.observaciones || ticket.observaciones.length === 0) return ticket.estado_general || "pendiente";
    const estados = ticket.observaciones.map((obs: any) => obs.estado);
    if (estados.every((e: any) => e === "terminado")) return "terminado";
    if (estados.some((e: any) => e === "en proceso")) return "en proceso";
    return "pendiente";
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const handleCreateTicket = () => {
    navigate("/crear-ticket");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-72 bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <img 
            src="https://www.pitagora.cl/images/logo_up_pitagora.gif" 
            alt="Pitágora Logo" 
            className="h-12 mb-4"
          />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <p className="text-sm font-medium">{mockUser.nombre}</p>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <p className="text-xs text-sidebar-foreground/80">{mockUser.obra}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <Button
              variant={activeSection === "tickets" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("tickets")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Mis Solicitudes
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
      <main className="flex-1 overflow-hidden flex">
        {/* Tickets List */}
        <div className="w-96 border-r overflow-hidden flex flex-col">
          <div className="p-6 border-b space-y-4">
            <div>
              <h2 className="text-xl font-bold">Mis Tickets</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {loading ? "Cargando..." : `${totalObservaciones} observaciones en total`}
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
              {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
              ) : tickets.length === 0 ? (
                <p className="text-center text-muted-foreground p-8">No hay tickets registrados.</p>
              ) : (
                tickets
                  .filter(ticket => {
                    if (!searchTerm) return true;
                    const term = searchTerm.toLowerCase();
                    return ticket.observaciones?.some((obs: any) =>
                      obs.falla.toLowerCase().includes(term) ||
                      obs.ubicacion.toLowerCase().includes(term)
                    );
                  })
                  .map((ticket) => (
                    <TicketCard
                      key={ticket.id_ticket}
                      ticket={{ 
                        id: String(ticket.id_ticket),
                        obra: ticket.nombre_obra,
                        fecha: new Date(ticket.fecha_creacion).toLocaleDateString(),
                        estado: getTicketEstado(ticket),
                        observaciones: ticket.observaciones
                      }}
                      onClick={() => setSelectedTicket(ticket)}
                    />
                  ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Ticket Details */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              {selectedTicket ? (
                <TicketDetails ticket={{ 
                  id: String(selectedTicket.id_ticket),
                  obra: selectedTicket.nombre_obra,
                  descripcionObra: selectedTicket.descripcion_obra,
                  fecha: new Date(selectedTicket.fecha_creacion).toLocaleDateString(),
                  estado: getTicketEstado(selectedTicket),
                  observaciones: selectedTicket.observaciones
                }} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  {loading ? "Cargando detalles..." : "Selecciona un ticket para ver los detalles"}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  );
}