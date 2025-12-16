import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./analytics/analytics')
  }
] as Routes;