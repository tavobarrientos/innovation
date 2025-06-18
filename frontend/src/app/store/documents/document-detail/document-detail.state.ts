import { Document } from '../document.model';

export interface DocumentDetailState {
  currentDocument: Document | null;
  loading: boolean;
  saving: boolean;
  error: any;
  isEditMode: boolean;
  autosaveEnabled: boolean;
}

export const initialDocumentDetailState: DocumentDetailState = {
  currentDocument: null,
  loading: false,
  saving: false,
  error: null,
  isEditMode: false,
  autosaveEnabled: false
};
