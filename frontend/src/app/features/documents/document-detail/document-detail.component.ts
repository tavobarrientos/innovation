import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppState } from '../../../store';
import { Document } from '../../../store/documents';
import * as DocumentDetailActions from '../../../store/documents/document-detail/document-detail.actions';
import { selectCurrentDocument, selectDocumentLoading, selectDocumentSaving } from '../../../store/documents/document-detail/document-detail.selectors';

@Component({
  selector: 'app-document-detail',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.scss'
})
export class DocumentDetailComponent implements OnInit, OnDestroy {
  document$: Observable<Document | null>;
  loading$: Observable<boolean>;
  saving$: Observable<boolean>;
  
  documentForm: FormGroup;
  isEditMode = false;
  isCreateMode = false;
  documentId: string | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.document$ = this.store.select(selectCurrentDocument);
    this.loading$ = this.store.select(selectDocumentLoading);
    this.saving$ = this.store.select(selectDocumentSaving);
    
    this.documentForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      status: ['draft', Validators.required],
      tags: ['']
    });
  }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.documentId = params['id'];
      
      if (this.documentId) {
        this.isCreateMode = false;
        this.store.dispatch(DocumentDetailActions.loadDocument({ id: this.documentId }));
      } else {
        this.isCreateMode = true;
        this.enableEditMode();
      }
    });

    this.document$.pipe(takeUntil(this.destroy$)).subscribe(document => {
      if (document && !this.isCreateMode) {
        this.documentForm.patchValue({
          title: document.title,
          content: document.content,
          status: document.status,
          tags: document.tags.join(', ')
        });
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(DocumentDetailActions.clearCurrentDocument());
  }

  enableEditMode() {
    this.isEditMode = true;
    this.documentForm.enable();
    this.store.dispatch(DocumentDetailActions.enterEditMode());
  }

  cancelEdit() {
    if (this.isCreateMode) {
      this.router.navigate(['/documents/list']);
    } else {
      this.isEditMode = false;
      this.documentForm.disable();
      this.store.dispatch(DocumentDetailActions.exitEditMode());
      
      // Reset form to original values
      this.document$.pipe(takeUntil(this.destroy$)).subscribe(document => {
        if (document) {
          this.documentForm.patchValue({
            title: document.title,
            content: document.content,
            status: document.status,
            tags: document.tags.join(', ')
          });
        }
      });
    }
  }

  saveDocument() {
    if (this.documentForm.valid && this.documentId) {
      const formValue = this.documentForm.value;
      const tags = formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [];
      
      this.store.dispatch(DocumentDetailActions.updateDocument({
        update: {
          id: this.documentId,
          title: formValue.title,
          content: formValue.content,
          status: formValue.status,
          tags: tags
        }
      }));
      
      this.isEditMode = false;
      this.documentForm.disable();
    }
  }

  deleteDocument() {
    if (this.documentId && confirm('Are you sure you want to delete this document?')) {
      // Note: We'll need to add a delete action to document detail or navigate back and dispatch from list
      this.router.navigate(['/documents/list']);
    }
  }

  goBack() {
    this.router.navigate(['/documents/list']);
  }
}
