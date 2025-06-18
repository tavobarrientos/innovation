import { Document } from '../document.model';

export interface DocumentsListState {
  documents: Document[];
  loading: boolean;
  error: any;
  filter: string;
}

export const initialDocumentsListState: DocumentsListState = {
  documents: [],
  loading: false,
  error: null,
  filter: ''
};
