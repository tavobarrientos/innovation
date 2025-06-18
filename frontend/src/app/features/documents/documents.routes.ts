import { Routes } from '@angular/router';
import { DocumentsListComponent } from './documents-list/documents-list.component';
import { DocumentDetailComponent } from './document-detail/document-detail.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';

export const documentsRoutes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: DocumentsListComponent,
    title: 'Documents List'
  },
  {
    path: 'detail/:id',
    component: DocumentDetailComponent,
    title: 'Document Detail'
  },
  {
    path: 'create',
    component: DocumentDetailComponent,
    title: 'Create Document'
  },
  {
    path: 'upload',
    component: DocumentUploadComponent,
    title: 'Upload Document'
  }
];
