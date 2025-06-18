import { createAction, props } from '@ngrx/store';
import { Document, DocumentCreateRequest } from '../../../shared/models/document.interface';

// Load Documents Actions
export const loadDocuments = createAction('[Documents List] Load Documents');

export const loadDocumentsSuccess = createAction(
  '[Documents List] Load Documents Success',
  props<{ documents: Document[] }>()
);

export const loadDocumentsFailure = createAction(
  '[Documents List] Load Documents Failure',
  props<{ error: any }>()
);

// Create Document Actions
export const createDocument = createAction(
  '[Documents List] Create Document',
  props<{ document: DocumentCreateRequest }>()
);

export const createDocumentSuccess = createAction(
  '[Documents List] Create Document Success',
  props<{ document: Document }>()
);

export const createDocumentFailure = createAction(
  '[Documents List] Create Document Failure',
  props<{ error: any }>()
);

// Delete Document Actions
export const deleteDocument = createAction(
  '[Documents List] Delete Document',
  props<{ id: string }>()
);

export const deleteDocumentSuccess = createAction(
  '[Documents List] Delete Document Success',
  props<{ id: string }>()
);

export const deleteDocumentFailure = createAction(
  '[Documents List] Delete Document Failure',
  props<{ error: any }>()
);

// Filter Actions
export const setFilter = createAction(
  '[Documents List] Set Filter',
  props<{ filter: string }>()
);

export const clearFilter = createAction('[Documents List] Clear Filter');
