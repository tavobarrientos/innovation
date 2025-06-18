import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DocumentsListState } from './documents-list.state';

export const selectDocumentsListState = createFeatureSelector<DocumentsListState>('documentsList');

export const selectAllDocuments = createSelector(
  selectDocumentsListState,
  (state: DocumentsListState) => state.documents
);

export const selectDocumentsLoading = createSelector(
  selectDocumentsListState,
  (state: DocumentsListState) => state.loading
);

export const selectDocumentsError = createSelector(
  selectDocumentsListState,
  (state: DocumentsListState) => state.error
);

export const selectDocumentsFilter = createSelector(
  selectDocumentsListState,
  (state: DocumentsListState) => state.filter
);

export const selectFilteredDocuments = createSelector(
  selectAllDocuments,
  selectDocumentsFilter,
  (documents, filter) => {
    if (!filter) {
      return documents;
    }
    return documents.filter(doc => 
      doc.title.toLowerCase().includes(filter.toLowerCase()) ||
      doc.content.toLowerCase().includes(filter.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
    );
  }
);

export const selectDocumentsCount = createSelector(
  selectAllDocuments,
  (documents) => documents.length
);

export const selectPublishedDocuments = createSelector(
  selectAllDocuments,
  (documents) => documents.filter(doc => doc.status === 'published')
);

export const selectDraftDocuments = createSelector(
  selectAllDocuments,
  (documents) => documents.filter(doc => doc.status === 'draft')
);
