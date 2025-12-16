import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./library-list/library-list')
  }
] as Routes;
