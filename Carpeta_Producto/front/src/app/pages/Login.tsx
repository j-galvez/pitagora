import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Mail, Lock } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - en producción esto sería una llamada a la API
    if (email && password) {
      // Verificar si el email es de dominio @pitagora.cl
      if (email.endsWith("@pitagora.cl")) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock password recovery
    alert(`Se ha enviado un correo de recuperación a: ${recoveryEmail}`);
    setShowRecovery(false);
    setRecoveryEmail("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003860] to-[#91ABC6] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <img 
              src="https://www.pitagora.cl/images/logo_up_pitagora.gif" 
              alt="Pitágora Logo" 
              className="h-16"
            />
          </div>
          <CardTitle>Sistema de Postventa</CardTitle>
          <CardDescription>
            {showRecovery 
              ? "Recupera tu contraseña" 
              : "Ingresa tus credenciales para acceder"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showRecovery ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Ingresar
              </Button>
              <button
                type="button"
                onClick={() => setShowRecovery(true)}
                className="w-full text-sm text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </form>
          ) : (
            <form onSubmit={handleRecovery} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recovery-email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="recovery-email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Enviar Correo de Recuperación
              </Button>
              <button
                type="button"
                onClick={() => setShowRecovery(false)}
                className="w-full text-sm text-primary hover:underline"
              >
                Volver al inicio de sesión
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
