import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DocumentDetailState } from './document-detail.state';

export const selectDocumentDetailState = createFeatureSelector<DocumentDetailState>('documentDetail');

export const selectCurrentDocument = createSelector(
  selectDocumentDetailState,
  (state: DocumentDetailState) => state.currentDocument
);

export const selectDocumentLoading = createSelector(
  selectDocumentDetailState,
  (state: DocumentDetailState) => state.loading
);

export const selectDocumentSaving = createSelector(
  selectDocumentDetailState,
  (state: DocumentDetailState) => state.saving
);

export const selectDocumentError = createSelector(
  selectDocumentDetailState,
  (state: DocumentDetailState) => state.error
);

export const selectIsEditMode = createSelector(
  selectDocumentDetailState,
  (state: DocumentDetailState) => state.isEditMode
);

export const selectAutosaveEnabled = createSelector(
  selectDocumentDetailState,
  (state: DocumentDetailState) => state.autosaveEnabled
);

export const selectCurrentDocumentId = createSelector(
  selectCurrentDocument,
  (document) => document?.id || null
);

export const selectCurrentDocumentTitle = createSelector(
  selectCurrentDocument,
  (document) => document?.title || ''
);

export const selectCurrentDocumentContent = createSelector(
  selectCurrentDocument,
  (document) => document?.content || ''
);

export const selectCurrentDocumentStatus = createSelector(
  selectCurrentDocument,
  (document) => document?.status || 'draft'
);

export const selectCurrentDocumentTags = createSelector(
  selectCurrentDocument,
  (document) => document?.tags || []
);
