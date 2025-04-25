/**
 * Core domain entity: Comment
 * Represents a comment on a blog post
 */

import { User } from "./user";
import { Post } from "./post";

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: User;
  authorId: string;
  post: Post;
  postId: string;
}