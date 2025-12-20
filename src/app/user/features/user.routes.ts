import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./users/users')
  }
] as Routes;
