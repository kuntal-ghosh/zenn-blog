"use client";
import React from "react";
import { useAuth } from "../../hooks/useAuth";
import LoginForm from "../presentational/LoginForm";
import RegisterForm from "../presentational/RegisterForm";

const AuthContainer: React.FC = () => {
  const { isAuthenticated, login, register,loading } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {isAuthenticated ? (
        <h2 className="text-xl">Welcome back!</h2>
      ) : (
        <div className="w-full max-w-md">
          <h2 className="text-2xl mb-4">Login or Register</h2>
          <LoginForm onSubmit={login} />
          <RegisterForm onRegister={register} />
        </div>
      )}
    </div>
  );
};

export default AuthContainer;
