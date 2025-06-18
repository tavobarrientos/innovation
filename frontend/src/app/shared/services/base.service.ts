import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BaseEntity {
  id: string | number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

export class BaseService<T extends BaseEntity> {
  
  constructor(
    protected http: HttpClient,
    protected baseUrl: string
  ) {}

  /**
   * Get all entities with optional query parameters
   */
  get(params?: QueryParams): Observable<T[]> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<T[]>(this.baseUrl, { params: httpParams });
  }

  /**
   * Get paginated entities
   */
  getPaginated(page: number = 1, limit: number = 10, params?: QueryParams): Observable<PaginatedResponse<T>> {
    let httpParams = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<PaginatedResponse<T>>(`${this.baseUrl}/paginated`, { params: httpParams });
  }

  /**
   * Get entity by ID
   */
  getById(id: string | number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create new entity
   */
  post(entity: Omit<T, 'id'>): Observable<T> {
    return this.http.post<T>(this.baseUrl, entity);
  }

  /**
   * Update existing entity
   */
  put(id: string | number, entity: Partial<T>): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${id}`, entity);
  }

  /**
   * Partially update entity
   */
  patch(id: string | number, entity: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${id}`, entity);
  }

  /**
   * Delete entity by ID
   */
  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Upload file
   */
  upload(file: File, additionalData?: { [key: string]: any }): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    return this.http.post<T>(`${this.baseUrl}/upload`, formData);
  }

  /**
   * Bulk upload multiple files
   */
  uploadMultiple(files: File[], additionalData?: { [key: string]: any }): Observable<T[]> {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    return this.http.post<T[]>(`${this.baseUrl}/upload-multiple`, formData);
  }

  /**
   * Search entities
   */
  search(query: string, params?: QueryParams): Observable<T[]> {
    let httpParams = new HttpParams().set('q', query);
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<T[]>(`${this.baseUrl}/search`, { params: httpParams });
  }

  /**
   * Get entities count
   */
  count(params?: QueryParams): Observable<{ count: number }> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<{ count: number }>(`${this.baseUrl}/count`, { params: httpParams });
  }

  /**
   * Custom HTTP request
   */
  customRequest<R = any>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    body?: any,
    options?: {
      headers?: HttpHeaders | { [header: string]: string | string[] };
      params?: HttpParams | { [param: string]: string | string[] };
    }
  ): Observable<R> {
    const url = `${this.baseUrl}/${endpoint}`;
    
    switch (method) {
      case 'GET':
        return this.http.get<R>(url, options);
      case 'POST':
        return this.http.post<R>(url, body, options);
      case 'PUT':
        return this.http.put<R>(url, body, options);
      case 'PATCH':
        return this.http.patch<R>(url, body, options);
      case 'DELETE':
        return this.http.delete<R>(url, options);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
}
