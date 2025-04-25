/**
 * Core domain entity: Post
 * Represents a blog post in the system
 */

import { User } from "./user";
import { Tag } from "./tag";
import { Comment } from "./comment";

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: any; // TipTap JSON content structure
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: User;
  authorId: string;
  comments?: Comment[];
  tags?: Tag[];
}