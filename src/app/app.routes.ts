import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './core/auth.guard';

export const routes: Routes = [
    {
    canActivateChild: [publicGuard()],
    path: 'auth',
    loadChildren: () => import('./auth/features/auth.routes'),
  },
  {
    canActivateChild: [privateGuard()],
    path: 'chat',
    loadComponent: () => import('./shared/ui/layout.component'),
    loadChildren: () => import('./search/features/search.routes'),
  },
  {
    canActivateChild: [privateGuard()],
    path: 'biblioteca',
    loadComponent: () => import('./shared/ui/layout.component'),
    loadChildren: () => import('./library/features/library.routes'),
  },
  {
    canActivateChild: [privateGuard()],
    path: 'analíticas',
    loadComponent: () => import('./shared/ui/layout.component'),
    loadChildren: () => import('./analytics/features/analytics.routes'),
  },
  {
    path: '**',
    redirectTo: 'biblioteca',
  },
];
