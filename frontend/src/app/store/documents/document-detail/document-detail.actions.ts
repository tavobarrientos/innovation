import { createAction, props } from '@ngrx/store';
import { Document, DocumentUpdateRequest } from '../document.model';

// Load Document Actions
export const loadDocument = createAction(
  '[Document Detail] Load Document',
  props<{ id: string }>()
);

export const loadDocumentSuccess = createAction(
  '[Document Detail] Load Document Success',
  props<{ document: Document }>()
);

export const loadDocumentFailure = createAction(
  '[Document Detail] Load Document Failure',
  props<{ error: any }>()
);

// Update Document Actions
export const updateDocument = createAction(
  '[Document Detail] Update Document',
  props<{ update: DocumentUpdateRequest }>()
);

export const updateDocumentSuccess = createAction(
  '[Document Detail] Update Document Success',
  props<{ document: Document }>()
);

export const updateDocumentFailure = createAction(
  '[Document Detail] Update Document Failure',
  props<{ error: any }>()
);

// Clear Document Action
export const clearCurrentDocument = createAction('[Document Detail] Clear Current Document');

// Edit Mode Actions
export const enterEditMode = createAction('[Document Detail] Enter Edit Mode');

export const exitEditMode = createAction('[Document Detail] Exit Edit Mode');

// Autosave Actions
export const enableAutosave = createAction('[Document Detail] Enable Autosave');

export const disableAutosave = createAction('[Document Detail] Disable Autosave');
