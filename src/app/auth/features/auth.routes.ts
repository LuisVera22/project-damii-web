import { Routes } from "@angular/router";

export default [
    {
        path: 'sign-in',
        loadComponent: () => import('./sign-in/sign-in')
    },
    {
        path: 'sign-up',
        loadComponent: () => import('./sign-up/sign-up')
    },
    {
        path: 'reset-password',
        loadComponent: () => import('./reset-password/reset-password')
    }
] as Routes