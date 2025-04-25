/**
 * Data Transfer Objects for Auth-related operations
 */

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  id: string;
  name?: string;
  email: string;
  image?: string;
  token?: string;
}

export interface UserResponseDTO {
  id: string;
  name?: string;
  email: string;
  image?: string;
  bio?: string;
  createdAt: Date;
}