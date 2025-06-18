import { createReducer, on } from '@ngrx/store';
import { DocumentDetailState, initialDocumentDetailState } from './document-detail.state';
import * as DocumentDetailActions from './document-detail.actions';

// Re-export the state interface
export type { DocumentDetailState } from './document-detail.state';

export const documentDetailReducer = createReducer(
  initialDocumentDetailState,
  
  // Load Document
  on(DocumentDetailActions.loadDocument, (state): DocumentDetailState => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(DocumentDetailActions.loadDocumentSuccess, (state, { document }): DocumentDetailState => ({
    ...state,
    currentDocument: document,
    loading: false,
    error: null
  })),
  
  on(DocumentDetailActions.loadDocumentFailure, (state, { error }): DocumentDetailState => ({
    ...state,
    loading: false,
    error
  })),
  
  // Update Document
  on(DocumentDetailActions.updateDocument, (state): DocumentDetailState => ({
    ...state,
    saving: true,
    error: null
  })),
  
  on(DocumentDetailActions.updateDocumentSuccess, (state, { document }): DocumentDetailState => ({
    ...state,
    currentDocument: document,
    saving: false,
    error: null
  })),
  
  on(DocumentDetailActions.updateDocumentFailure, (state, { error }): DocumentDetailState => ({
    ...state,
    saving: false,
    error
  })),
  
  // Clear Document
  on(DocumentDetailActions.clearCurrentDocument, (state): DocumentDetailState => ({
    ...state,
    currentDocument: null,
    error: null,
    isEditMode: false
  })),
  
  // Edit Mode
  on(DocumentDetailActions.enterEditMode, (state): DocumentDetailState => ({
    ...state,
    isEditMode: true
  })),
  
  on(DocumentDetailActions.exitEditMode, (state): DocumentDetailState => ({
    ...state,
    isEditMode: false
  })),
  
  // Autosave
  on(DocumentDetailActions.enableAutosave, (state): DocumentDetailState => ({
    ...state,
    autosaveEnabled: true
  })),
  
  on(DocumentDetailActions.disableAutosave, (state): DocumentDetailState => ({
    ...state,
    autosaveEnabled: false
  }))
);
