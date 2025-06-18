import { ActionReducerMap } from '@ngrx/store';
import { documentsListReducer, DocumentsListState } from './documents/documents-list/documents-list.reducer';
import { documentDetailReducer, DocumentDetailState } from './documents/document-detail/document-detail.reducer';

export interface AppState {
  documentsList: DocumentsListState;
  documentDetail: DocumentDetailState;
}

export const reducers: ActionReducerMap<AppState> = {
  documentsList: documentsListReducer,
  documentDetail: documentDetailReducer
};

// Export all store modules
export * from './documents/index';
