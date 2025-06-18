export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
}

export interface DocumentCreateRequest {
  title: string;
  content: string;
  tags: string[];
}

export interface DocumentUpdateRequest {
  id: string;
  title?: string;
  content?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
}
