/**
 * Core domain entity: Image
 * Represents an uploaded image in the system
 */

import { User } from "./user";

export interface Image {
  id: string;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  width: number;
  height: number;
  size: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
  uploadedBy: User;
  userId: string;
}