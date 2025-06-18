import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../../../store';
import { Document } from '../../../store/documents';
import * as DocumentsListActions from '../../../store/documents/documents-list/documents-list.actions';
import { selectAllDocuments, selectDocumentsLoading, selectDocumentsError } from '../../../store/documents/documents-list/documents-list.selectors';

@Component({
  selector: 'app-documents-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './documents-list.component.html',
  styleUrl: './documents-list.component.scss'
})
export class DocumentsListComponent implements OnInit {
  documents$: Observable<Document[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  constructor(private store: Store<AppState>) {
    this.documents$ = this.store.select(selectAllDocuments);
    this.loading$ = this.store.select(selectDocumentsLoading);
    this.error$ = this.store.select(selectDocumentsError);
  }

  ngOnInit() {
    this.store.dispatch(DocumentsListActions.loadDocuments());
  }

  onCreateDocument() {
    this.store.dispatch(DocumentsListActions.createDocument({
      document: {
        title: 'New Document',
        content: 'This is a new document created from the documents list page',
        tags: ['new', 'created'],
        category: 'general',
      }
    }));
  }

  onDeleteDocument(id: string) {
    if (confirm('Are you sure you want to delete this document?')) {
      this.store.dispatch(DocumentsListActions.deleteDocument({ id }));
    }
  }

  trackByDocumentId(index: number, document: Document): string {
    return document.id;
  }
}
