import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService, PaginatedResponse } from '../../../shared/services/base.service';
import { Document, DocumentCreateRequest, DocumentUpdateRequest, DocumentSearchQuery } from '../../../shared/models/document.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService extends BaseService<Document> {
  
  constructor(http: HttpClient) {
    super(http, `${environment?.apiUrl || 'http://localhost:3000/api'}/documents`);
  }

  /**
   * Create a new document
   */
  createDocument(document: DocumentCreateRequest): Observable<Document> {
    return this.post(document as any);
  }

  /**
   * Update an existing document
   */
  updateDocument(request: DocumentUpdateRequest): Observable<Document> {
    return this.put(request.id, request);
  }

  /**
   * Search documents with advanced filters
   */
  searchDocuments(query: DocumentSearchQuery): Observable<PaginatedResponse<Document>> {
    const params: any = {};
    
    if (query.query) params.q = query.query;
    if (query.category) params.category = query.category;
    if (query.status) params.status = query.status;
    if (query.authorId) params.authorId = query.authorId;
    if (query.tags && query.tags.length > 0) params.tags = query.tags.join(',');
    if (query.dateFrom) params.dateFrom = query.dateFrom.toISOString();
    if (query.dateTo) params.dateTo = query.dateTo.toISOString();
    if (query.sortBy) params.sortBy = query.sortBy;
    if (query.sortOrder) params.sortOrder = query.sortOrder;

    const page = query.page || 1;
    const limit = query.limit || 10;
    
    return this.getPaginated(page, limit, params);
  }

  /**
   * Get documents by category
   */
  getDocumentsByCategory(category: string): Observable<Document[]> {
    return this.get({ category });
  }

  /**
   * Get documents by status
   */
  getDocumentsByStatus(status: string): Observable<Document[]> {
    return this.get({ status });
  }

  /**
   * Get documents by author
   */
  getDocumentsByAuthor(authorId: string): Observable<Document[]> {
    return this.get({ authorId });
  }

  /**
   * Upload document file
   */
  uploadDocumentFile(file: File, metadata?: Partial<Document>): Observable<Document> {
    return this.upload(file, metadata);
  }

  /**
   * Upload multiple document files
   */
  uploadMultipleFiles(files: File[], metadata?: Partial<Document>): Observable<Document[]> {
    return this.uploadMultiple(files, metadata);
  }

  /**
   * Download document file
   */
  downloadDocument(documentId: string): Observable<Blob> {
    return this.customRequest<Blob>('GET', `${documentId}/download`);
  }

  /**
   * Get document statistics
   */
  getDocumentStats(): Observable<{
    total: number;
    byStatus: { [status: string]: number };
    byCategory: { [category: string]: number };
    byFileType: { [fileType: string]: number };
    recentlyCreated: number;
    recentlyUpdated: number;
  }> {
    return this.customRequest('GET', 'stats');
  }

  /**
   * Get popular tags
   */
  getPopularTags(limit: number = 20): Observable<{ tag: string; count: number }[]> {
    return this.customRequest('GET', 'tags/popular', undefined, {
      params: { limit: limit.toString() }
    });
  }

  /**
   * Get all categories
   */
  getCategories(): Observable<string[]> {
    return this.customRequest('GET', 'categories');
  }

  /**
   * Duplicate a document
   */
  duplicateDocument(documentId: string, newTitle?: string): Observable<Document> {
    return this.customRequest('POST', `${documentId}/duplicate`, { newTitle });
  }

  /**
   * Archive/Unarchive a document
   */
  toggleArchiveStatus(documentId: string): Observable<Document> {
    return this.customRequest('PATCH', `${documentId}/archive`);
  }

  /**
   * Publish/Unpublish a document
   */
  togglePublishStatus(documentId: string): Observable<Document> {
    return this.customRequest('PATCH', `${documentId}/publish`);
  }
}
