/**
 * Core domain entity: User
 * Represents a user in the system
 */

export interface User {
  id: string;
  name?: string;
  email: string;
  image?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}