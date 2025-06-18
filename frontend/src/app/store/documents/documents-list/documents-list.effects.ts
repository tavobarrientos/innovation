import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import * as DocumentsListActions from './documents-list.actions';
import { Document, DocumentCreateRequest } from '../../../shared/models/document.interface';
import { DocumentService } from '../../../features/documents/services/document.service';

@Injectable()
export class DocumentsListEffects {
    
  actions$ = inject(Actions);
  documentService = inject(DocumentService);

  loadDocuments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsListActions.loadDocuments),
      mergeMap(() =>
        this.documentService.get().pipe(
          map(documents => DocumentsListActions.loadDocumentsSuccess({ documents })),
          catchError(error => of(DocumentsListActions.loadDocumentsFailure({ error: error.message || 'Failed to load documents' })))
        )
      )
    )
  );

  createDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsListActions.createDocument),
      switchMap(({ document }) =>
        this.documentService.createDocument(document).pipe(
          map(createdDocument => DocumentsListActions.createDocumentSuccess({ document: createdDocument })),
          catchError(error => of(DocumentsListActions.createDocumentFailure({ error })))
        )
      )
    )
  );

  deleteDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentsListActions.deleteDocument),
      switchMap(({ id }) =>
        // TODO: Replace with actual service call
        this.deleteMockDocument(id).pipe(
          map(() => DocumentsListActions.deleteDocumentSuccess({ id })),
          catchError(error => of(DocumentsListActions.deleteDocumentFailure({ error })))
        )
      )
    )  );

  // TODO: Replace these mock methods with actual service calls
  private getMockDocuments() {
    const mockDocuments: Document[] = [
      {
        id: '1',
        title: 'Sample Document 1',
        content: 'This is the content of document 1',
        description: 'A sample document for testing',
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
        status: 'published',
        tags: ['sample', 'demo'],
        category: 'examples'
      },
      {
        id: '2',
        title: 'Draft Document',
        content: 'This is a draft document',
        description: 'A work-in-progress document',
        createdAt: new Date('2025-01-02'),
        updatedAt: new Date('2025-01-02'),
        status: 'draft',
        tags: ['draft', 'work-in-progress'],
        category: 'drafts'
      }
    ];
    return of(mockDocuments);
  }
  private createMockDocument(request: DocumentCreateRequest) {
    const newDocument: Document = {
      id: Date.now().toString(),
      title: request.title,
      content: request.content,
      description: request.description,
      tags: request.tags || [],
      category: request.category || 'general',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft'
    };
    return of(newDocument);
  }

  private deleteMockDocument(id: string) {
    // Simulate API call delay
    return of(true);
  }
}
