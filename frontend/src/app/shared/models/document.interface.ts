import { BaseEntity } from '../services/base.service';

export interface Document extends BaseEntity {
  id: string;
  title: string;
  content: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  category: string;
  fileType?: 'txt' | 'json' | 'markdown' | 'pdf';
  fileSize?: number;
  author?: string;
  version?: number;
  metadata?: {
    [key: string]: any;
  };
}

export interface DocumentCreateRequest {
  title: string;
  content: string;
  description?: string;
  tags: string[];
  category: string;
  fileType?: 'txt' | 'json' | 'markdown' | 'pdf';
  metadata?: {
    [key: string]: any;
  };
}

export interface DocumentUpdateRequest {
  id: string;
  title?: string;
  content?: string;
  description?: string;
  tags?: string[];
  category?: string;
  status?: 'draft' | 'published' | 'archived';
  metadata?: {
    [key: string]: any;
  };
}

export interface DocumentSearchResult {
  documents: Document[];
  total: number;
  page: number;
  limit: number;
  query: string;
  facets?: {
    categories: { [category: string]: number };
    tags: { [tag: string]: number };
    statuses: { [status: string]: number };
    fileTypes: { [fileType: string]: number };
  };
}

export interface DocumentSearchQuery {
  query?: string;
  category?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  authorId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface DocumentFilter {
  category?: string;
  status?: 'draft' | 'published' | 'archived';
  fileType?: 'txt' | 'json' | 'markdown' | 'pdf';
  tags?: string[];
  author?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
