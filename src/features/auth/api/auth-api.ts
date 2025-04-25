/**
 * Auth feature API adapter
 * Connects the application layer to the Next.js API routes
 */

import { NextRequest, NextResponse } from "next/server";
import { AuthUseCases } from "../../../core/application/use-cases/auth-use-cases";
import { LoginDTO, RegisterUserDTO } from "../../../core/application/dto/auth-dto";

export class AuthApiAdapter {
  constructor(private authUseCases: AuthUseCases) {}

  async handleRegister(req: NextRequest) {
    try {
      const data = await req.json();
      const user = await this.authUseCases.register(data as RegisterUserDTO);
      return NextResponse.json(user, { status: 201 });
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Failed to register user" },
        { status: 400 }
      );
    }
  }

  async handleLogin(req: NextRequest) {
    try {
      const data = await req.json();
      const user = await this.authUseCases.login(data as LoginDTO);
      return NextResponse.json(user);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Failed to login" },
        { status: 401 }
      );
    }
  }

  async handleGetUser(id: string) {
    try {
      const user = await this.authUseCases.getUserById(id);
      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(user);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Failed to fetch user data" },
        { status: 500 }
      );
    }
  }

  async handleUpdateUser(req: NextRequest, id: string) {
    try {
      const data = await req.json();
      const user = await this.authUseCases.updateUser(id, data);
      return NextResponse.json(user);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Failed to update user" },
        { status: 400 }
      );
    }
  }
}