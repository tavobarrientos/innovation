import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import * as DocumentDetailActions from './document-detail.actions';
import { Document, DocumentUpdateRequest } from '../../../shared/models/document.interface';
import { DocumentService } from '../../../features/documents/services/document.service';

@Injectable()
export class DocumentDetailEffects {

  actions$ = inject(Actions);
  documentService = inject(DocumentService);

  loadDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentDetailActions.loadDocument),
      switchMap(({ id }) =>
        this.documentService.getById(id).pipe(
          map(document => DocumentDetailActions.loadDocumentSuccess({ document })),
          catchError(error => of(DocumentDetailActions.loadDocumentFailure({ error: error.message || 'Failed to load document' })))
        )
      )
    )
  );

  updateDocument$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocumentDetailActions.updateDocument),
      switchMap(({ update }) =>
        this.documentService.updateDocument(update).pipe(
          map(document => DocumentDetailActions.updateDocumentSuccess({ document })),
          catchError(error => of(DocumentDetailActions.updateDocumentFailure({ error })))
        )
      )
    )
  );


  // TODO: Replace these mock methods with actual service calls
  private getMockDocument(id: string) {
    const mockDocument: Document = {
      id,
      title: `Document ${id}`,
      content: `This is the content of document ${id}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      description: `Description for document ${id}`,
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date(),
      status: Math.random() > 0.5 ? 'published' : 'draft',
      tags: ['sample', 'document', `tag-${id}`],
      category: 'general'
    };
    return of(mockDocument);
  }

  private updateMockDocument(update: DocumentUpdateRequest) {
    // Simulate getting the current document and updating it
    const updatedDocument: Document = {
      id: update.id,
      title: update.title || `Document ${update.id}`,
      content: update.content || 'Updated content',
      description: update.description || 'Updated description',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date(),
      status: update.status || 'draft',
      tags: update.tags || [],
      category: update.category || 'general'
    };
    return of(updatedDocument);
  }
}
