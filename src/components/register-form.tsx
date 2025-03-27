"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // Reiniciar mensaje

    if (!username.trim()) {
      setMessage("El nombre de usuario es obligatorio.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    // Registrar usuario
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Error registrando:", error.message);
      setMessage("Error: " + error.message);
      return;
    }

    if (!data?.user) {
      setMessage("No se pudo registrar el usuario.");
      return;
    }

    // Verificar si el username ya está en uso
    const { data: existingUsers, error: userCheckError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username);

    if (userCheckError) {
      console.error(
        "Error al verificar el nombre de usuario:",
        userCheckError.message
      );
      setMessage("Error al verificar el nombre de usuario.");
      return;
    }

    if (existingUsers.length > 0) {
      setMessage("El nombre de usuario ya está en uso.");
      return;
    }

    setMessage(
      "Se ha enviado un correo de confirmación. Verifica tu email antes de iniciar sesión."
    );
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Nombre de usuario</Label>
          <Input
            id="username"
            autoComplete="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            autoComplete="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            autoComplete="new-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
          <Input
            id="confirmPassword"
            autoComplete="new-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Registrarse
        </Button>
      </form>

      {message && <p className="text-center text-sm text-red-500">{message}</p>}
    </div>
  );
}
