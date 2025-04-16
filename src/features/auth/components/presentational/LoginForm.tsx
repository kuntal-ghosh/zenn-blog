"use client";
import React, { useState } from "react";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";

const LoginForm: React.FC<{
  onSubmit: (email: string, password: string) => void;
}> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError(null);
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit">Login</Button>
    </form>
  );
};

export default LoginForm;
