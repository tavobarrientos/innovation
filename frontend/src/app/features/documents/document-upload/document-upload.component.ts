import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppState } from '../../../store';
import * as DocumentsListActions from '../../../store/documents/documents-list/documents-list.actions';
import { selectDocumentsLoading } from '../../../store/documents/documents-list/documents-list.selectors';

@Component({
  selector: 'app-document-upload',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './document-upload.component.html',
  styleUrl: './document-upload.component.scss'
})
export class DocumentUploadComponent implements OnInit, OnDestroy {
  uploadForm: FormGroup;
  loading$: Observable<boolean>;
  selectedFile: File | null = null;
  isDragOver = false;
  uploadProgress = 0;
  
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loading$ = this.store.select(selectDocumentsLoading);
    
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      tags: [''],
      category: ['general', Validators.required]
    });
  }

  ngOnInit() {
    // Subscribe to any necessary observables
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      // Auto-populate title if not set
      if (!this.uploadForm.get('title')?.value) {
        const fileName = this.selectedFile.name.replace(/\.[^/.]+$/, ""); // Remove extension
        this.uploadForm.patchValue({ title: fileName });
      }
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.selectedFile = event.dataTransfer.files[0];
      
      // Auto-populate title if not set
      if (!this.uploadForm.get('title')?.value) {
        const fileName = this.selectedFile.name.replace(/\.[^/.]+$/, "");
        this.uploadForm.patchValue({ title: fileName });
      }
    }
  }

  removeFile() {
    this.selectedFile = null;
  }

  onUpload() {
    if (this.uploadForm.valid && this.selectedFile) {
      const formValue = this.uploadForm.value;
      const tags = formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : [];
        // Simulate file reading and create document
      const reader = new FileReader();
      reader.onload = (e) => {
        let content = '';
        
        // Handle different file types
        if (this.selectedFile!.type === 'application/json' || this.selectedFile!.name.toLowerCase().endsWith('.json')) {
          try {
            const jsonContent = JSON.parse(e.target?.result as string);
            content = JSON.stringify(jsonContent, null, 2); // Pretty print JSON
          } catch (error) {
            content = e.target?.result as string || 'Invalid JSON file';
          }
        } else if (this.selectedFile!.type === 'application/pdf') {
          content = 'PDF file uploaded. Content extraction not implemented in this demo.';
        } else {
          content = e.target?.result as string || 'File content could not be read';
        }
        
        this.store.dispatch(DocumentsListActions.createDocument({
          document: {
            title: formValue.title,
            content: content.substring(0, 2000) + (content.length > 2000 ? '...' : ''), // Increased truncation limit
            tags: [...tags, formValue.category, 'uploaded', this.getFileExtension()],
            category: formValue.category,
          }
        }));
        
        // Navigate back to documents list
        this.router.navigate(['/documents/list']);
      };
      
      // Use appropriate file reading method based on file type
      if (this.selectedFile.type === 'application/pdf') {
        // For PDF files, we'll just create a placeholder since actual PDF parsing would require additional libraries
        reader.onload({
          target: { result: 'PDF file content placeholder' }
        } as any);
      } else {
        reader.readAsText(this.selectedFile);
      }
    }
  }

  goBack() {
    this.router.navigate(['/documents/list']);
  }
  getFileSize(): string {
    if (!this.selectedFile) return '';
    const bytes = this.selectedFile.size;
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileExtension(): string {
    if (!this.selectedFile) return '';
    const fileName = this.selectedFile.name;
    const extension = fileName.toLowerCase().split('.').pop() || '';
    return extension;
  }
  isValidFileType(): boolean {
    if (!this.selectedFile) return true;
    const allowedTypes = ['text/plain', 'application/json', 'text/markdown', 'application/pdf'];
    const allowedExtensions = ['.txt', '.json', '.md', '.markdown', '.pdf'];
    
    return allowedTypes.includes(this.selectedFile.type) || 
           allowedExtensions.some(ext => this.selectedFile!.name.toLowerCase().endsWith(ext));
  }
}
