import { createReducer, on } from '@ngrx/store';
import { DocumentsListState, initialDocumentsListState } from './documents-list.state';
import * as DocumentsListActions from './documents-list.actions';

// Re-export the state interface
export type { DocumentsListState } from './documents-list.state';

export const documentsListReducer = createReducer(
  initialDocumentsListState,
  
  // Load Documents
  on(DocumentsListActions.loadDocuments, (state): DocumentsListState => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(DocumentsListActions.loadDocumentsSuccess, (state, { documents }): DocumentsListState => ({
    ...state,
    documents,
    loading: false,
    error: null
  })),
  
  on(DocumentsListActions.loadDocumentsFailure, (state, { error }): DocumentsListState => ({
    ...state,
    loading: false,
    error
  })),
  
  // Create Document
  on(DocumentsListActions.createDocument, (state): DocumentsListState => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(DocumentsListActions.createDocumentSuccess, (state, { document }): DocumentsListState => ({
    ...state,
    documents: [...state.documents, document],
    loading: false,
    error: null
  })),
  
  on(DocumentsListActions.createDocumentFailure, (state, { error }): DocumentsListState => ({
    ...state,
    loading: false,
    error
  })),
  
  // Delete Document
  on(DocumentsListActions.deleteDocument, (state): DocumentsListState => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(DocumentsListActions.deleteDocumentSuccess, (state, { id }): DocumentsListState => ({
    ...state,
    documents: state.documents.filter(doc => doc.id !== id),
    loading: false,
    error: null
  })),
  
  on(DocumentsListActions.deleteDocumentFailure, (state, { error }): DocumentsListState => ({
    ...state,
    loading: false,
    error
  })),
  
  // Filter
  on(DocumentsListActions.setFilter, (state, { filter }): DocumentsListState => ({
    ...state,
    filter
  })),
  
  on(DocumentsListActions.clearFilter, (state): DocumentsListState => ({
    ...state,
    filter: ''
  }))
);
