/**
 * Authentication Use Cases
 * Contains the business logic for authentication-related operations
 */

import { UserRepository } from "../../domain/interfaces/repositories";
import { 
  RegisterUserDTO, 
  LoginDTO,
  AuthResponseDTO,
  UserResponseDTO
} from "../dto/auth-dto";
import { hash, compare } from "bcrypt";

export class AuthUseCases {
  constructor(
    private userRepository: UserRepository,
  ) {}

  async register(data: RegisterUserDTO): Promise<AuthResponseDTO> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash the password
    const hashedPassword = await hash(data.password, 12);

    // Create the user
    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    // Return user data without password
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    };
  }

  async login(data: LoginDTO): Promise<AuthResponseDTO> {
    // Find the user
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isValidPassword = await compare(data.password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Return user data without password
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    };
  }

  async getUserById(id: string): Promise<UserResponseDTO | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;

    // Return user data without password
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      bio: user.bio,
      createdAt: user.createdAt,
    };
  }

  async updateUser(id: string, data: Partial<Omit<UserResponseDTO, 'id' | 'email'>>): Promise<UserResponseDTO> {
    // Check if user exists
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    // Update user data
    const updatedUser = await this.userRepository.update(id, data);

    // Return updated user data
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      bio: updatedUser.bio,
      createdAt: updatedUser.createdAt,
    };
  }
}