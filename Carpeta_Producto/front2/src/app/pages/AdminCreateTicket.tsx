import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ArrowLeft, Plus, Trash2, Upload, X, Image as ImageIcon, Video } from "lucide-react";
import { toast } from "sonner";

interface Observation {
  id: string;
  falla: string;
  ubicacion: string;
  descripcion: string;
  fotos: File[];
  video?: File;
  estado: "pendiente" | "en observación" | "aplica" | "en proceso" | "en espera aceptación" | "terminado" | "no aplica";
  urgencia: "alta" | "media" | "baja";
  categoria: "terminaciones pisos" | "terminaciones muros" | "terminaciones cielos" | "puertas y/o ventanas" | "mobiliario" | "cubierta" | "sanitario" | "electrico" | "climatizacion" | "otro";
}

// Mock obras disponibles
const obras = [
  { id: "1", nombre: "Edificio Los Almendros - Depto 305" },
  { id: "2", nombre: "Casa Los Robles - Lote 12" },
  { id: "3", nombre: "Edificio Vista Mar - Depto 801" },
  { id: "4", nombre: "Condominio Las Palmas - Casa 45" },
  { id: "5", nombre: "Edificio Nuevo Horizonte - Depto 102" },
];

export function AdminCreateTicket() {
  const navigate = useNavigate();
  const [selectedObra, setSelectedObra] = useState("");
  const [observaciones, setObservaciones] = useState<Observation[]>([]);
  const [isAddingObservation, setIsAddingObservation] = useState(false);

  // Estado para nueva observación
  const [newObservation, setNewObservation] = useState<Observation>({
    id: "",
    falla: "",
    ubicacion: "",
    descripcion: "",
    fotos: [],
    video: undefined,
    estado: "pendiente",
    urgencia: "media",
    categoria: "otro",
  });

  const handleAddObservation = () => {
    setIsAddingObservation(true);
    setNewObservation({
      id: `obs-${Date.now()}`,
      falla: "",
      ubicacion: "",
      descripcion: "",
      fotos: [],
      video: undefined,
      estado: "pendiente",
      urgencia: "media",
      categoria: "otro",
    });
  };

  const handleSaveObservation = () => {
    if (!newObservation.falla || !newObservation.ubicacion || !newObservation.descripcion) {
      toast.error("Por favor completa todos los campos de la observación");
      return;
    }

    setObservaciones([...observaciones, newObservation]);
    setIsAddingObservation(false);
    setNewObservation({
      id: "",
      falla: "",
      ubicacion: "",
      descripcion: "",
      fotos: [],
      video: undefined,
      estado: "pendiente",
      urgencia: "media",
      categoria: "otro",
    });
    toast.success("Observación agregada correctamente");
  };

  const handleCancelObservation = () => {
    setIsAddingObservation(false);
    setNewObservation({
      id: "",
      falla: "",
      ubicacion: "",
      descripcion: "",
      fotos: [],
      video: undefined,
      estado: "pendiente",
      urgencia: "media",
      categoria: "otro",
    });
  };

  const handleRemoveObservation = (id: string) => {
    setObservaciones(observaciones.filter(obs => obs.id !== id));
    toast.success("Observación eliminada");
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (newObservation.fotos.length + files.length > 4) {
      toast.error("Máximo 4 fotos por observación");
      return;
    }
    setNewObservation({
      ...newObservation,
      fotos: [...newObservation.fotos, ...files.slice(0, 4 - newObservation.fotos.length)],
    });
  };

  const handleRemovePhoto = (index: number) => {
    const newFotos = [...newObservation.fotos];
    newFotos.splice(index, 1);
    setNewObservation({ ...newObservation, fotos: newFotos });
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewObservation({ ...newObservation, video: file });
    }
  };

  const handleRemoveVideo = () => {
    setNewObservation({ ...newObservation, video: undefined });
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedObra) {
      toast.error("Debes seleccionar una obra");
      return;
    }

    if (observaciones.length === 0) {
      toast.error("Debes agregar al menos una observación");
      return;
    }

    // Simulación de envío
    toast.success("Ticket creado exitosamente");
    setTimeout(() => {
      navigate("/admin");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin")}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div className="flex-1">
            <h1 className="text-xl">Crear Nuevo Ticket (Admin)</h1>
          </div>
          <img
            src="https://www.pitagora.cl/images/logo_up_pitagora.gif"
            alt="Pitágora Logo"
            className="h-8"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6">
        <form onSubmit={handleSubmitTicket} className="space-y-6">
          {/* Selección de Obra */}
          <Card>
            <CardHeader>
              <CardTitle>Seleccionar Obra</CardTitle>
              <CardDescription>Elige la obra a la que pertenece este ticket</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="obra">Obra</Label>
                <Select value={selectedObra} onValueChange={setSelectedObra}>
                  <SelectTrigger id="obra">
                    <SelectValue placeholder="Selecciona una obra" />
                  </SelectTrigger>
                  <SelectContent>
                    {obras.map((obra) => (
                      <SelectItem key={obra.id} value={obra.id}>
                        {obra.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Observaciones Guardadas */}
          {observaciones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Observaciones Agregadas ({observaciones.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {observaciones.map((obs, index) => (
                  <div key={obs.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm">Observación #{index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveObservation(obs.id)}
                        className="h-auto p-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Falla:</span> {obs.falla}</p>
                      <p><span className="font-medium">Ubicación:</span> {obs.ubicacion}</p>
                      <p><span className="font-medium">Categoría:</span> {obs.categoria}</p>
                      <p><span className="font-medium">Urgencia:</span> {obs.urgencia}</p>
                      <p><span className="font-medium">Descripción:</span> {obs.descripcion}</p>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>{obs.fotos.length} fotos</span>
                        {obs.video && <span>• 1 video</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Formulario Nueva Observación */}
          {isAddingObservation ? (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Nueva Observación</CardTitle>
                <CardDescription>Completa todos los campos para agregar la observación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="falla">Falla</Label>
                  <Input
                    id="falla"
                    placeholder="Ej: Grieta en muro del dormitorio"
                    value={newObservation.falla}
                    onChange={(e) => setNewObservation({ ...newObservation, falla: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ubicacion">Ubicación</Label>
                  <Input
                    id="ubicacion"
                    placeholder="Ej: Dormitorio principal, muro norte"
                    value={newObservation.ubicacion}
                    onChange={(e) => setNewObservation({ ...newObservation, ubicacion: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoría</Label>
                    <Select value={newObservation.categoria} onValueChange={(value) => setNewObservation({ ...newObservation, categoria: value as any })}>
                      <SelectTrigger id="categoria">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="terminaciones pisos">Terminaciones Pisos</SelectItem>
                        <SelectItem value="terminaciones muros">Terminaciones Muros</SelectItem>
                        <SelectItem value="terminaciones cielos">Terminaciones Cielos</SelectItem>
                        <SelectItem value="puertas y/o ventanas">Puertas y/o Ventanas</SelectItem>
                        <SelectItem value="mobiliario">Mobiliario</SelectItem>
                        <SelectItem value="cubierta">Cubierta</SelectItem>
                        <SelectItem value="sanitario">Sanitario</SelectItem>
                        <SelectItem value="electrico">Eléctrico</SelectItem>
                        <SelectItem value="climatizacion">Climatización</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgencia">Urgencia</Label>
                    <Select value={newObservation.urgencia} onValueChange={(value) => setNewObservation({ ...newObservation, urgencia: value as any })}>
                      <SelectTrigger id="urgencia">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="baja">Baja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción Detallada</Label>
                  <Textarea
                    id="descripcion"
                    placeholder="Describe en detalle el problema observado"
                    value={newObservation.descripcion}
                    onChange={(e) => setNewObservation({ ...newObservation, descripcion: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                {/* Fotos */}
                <div className="space-y-2">
                  <Label>Fotos (máximo 4)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {newObservation.fotos.map((foto, index) => (
                      <div key={index} className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                        <img
                          src={URL.createObjectURL(foto)}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemovePhoto(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {newObservation.fotos.length < 4 && (
                      <label className="aspect-video border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors">
                        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground">Agregar foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Video */}
                <div className="space-y-2">
                  <Label>Video (opcional, máximo 1)</Label>
                  {newObservation.video ? (
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                      <video
                        src={URL.createObjectURL(newObservation.video)}
                        className="w-full h-full"
                        controls
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={handleRemoveVideo}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  ) : (
                    <label className="aspect-video border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors">
                      <Video className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">Agregar video</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" onClick={handleSaveObservation} className="flex-1">
                    Guardar Observación
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancelObservation}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed border-2"
              onClick={handleAddObservation}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Observación
            </Button>
          )}

          {/* Submit */}
          <div className="flex gap-3 sticky bottom-0 bg-background pt-4 pb-2 border-t">
            <Button type="submit" className="flex-1" disabled={!selectedObra || observaciones.length === 0}>
              <Upload className="h-4 w-4 mr-2" />
              Crear Ticket
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/admin")}>
              Cancelar
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
