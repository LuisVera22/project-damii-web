import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'project-damii-12b43',
        appId: '1:203924237142:web:e5e0817d19f6e0c90544f7',
        storageBucket: 'project-damii-12b43.firebasestorage.app',
        apiKey: 'AIzaSyDwfoRyacznZ1delfoP99Br8tOEtyBbUt0',
        authDomain: 'project-damii-12b43.firebaseapp.com',
        messagingSenderId: '203924237142',
        measurementId: 'G-D6DY08LE4T'
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
