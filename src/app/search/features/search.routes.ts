import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./chat/chat')
  }
] as Routes;
