/**
 * Core domain entity: Tag
 * Represents a tag for categorizing blog posts
 */

import { Post } from "./post";

export interface Tag {
  id: string;
  name: string;
  posts?: Post[];
}