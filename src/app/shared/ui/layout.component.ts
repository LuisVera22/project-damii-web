import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStateService } from '../data-access/auth-state.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [RouterModule, RouterLink, RouterLinkActive, RouterOutlet, NgClass, NgIf],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
         text-slate-100 flex relative transition-all duration-500"
    >
      <!-- BOTÓN SIEMPRE VISIBLE -->
      <button
        class="absolute top-4 right-4 z-50 bg-slate-900/70 backdrop-blur-xl
           p-2 rounded-xl border border-slate-700 shadow-lg cursor-pointer
           hover:bg-slate-800 hover:shadow-xl transition-all duration-300"
        (click)="toggleSidebar()"
      >
        <!-- Ícono dinámico -->
        <ng-container *ngIf="isSidebarOpen; else iconClosed">
          <!-- Ícono hamburguesa -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </ng-container>

        <!-- Ícono "X" -->
        <ng-template #iconClosed>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </ng-template>
      </button>

      <!-- SIDEBAR -->
      <aside
        class="bg-slate-900/60 backdrop-blur-xl border-r border-slate-700
           flex flex-col p-6 overflow-hidden transition-all duration-500
           shadow-xl rounded-r-2xl"
        [ngClass]="isSidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'"
      >
        <!-- Branding -->
        <div class="mb-8 flex flex-col items-center">
          <img
            src="img/logo.png"
            class="w-32 h-auto mb-3 opacity-90 drop-shadow-[0_0_22px_rgba(255,255,255,0.3)]"
          />
          <p class="text-xs uppercase tracking-[0.09em] text-slate-400 font-bold">BIBLIOTECA VIRTUAL</p>
        </div>

        <!-- Navegación -->
        <nav class="flex-1 space-y-1 w-full">
          <a
            routerLink="/analiticas"
            routerLinkActive="bg-slate-800/70 text-green-400 border-l-2 border-green-500"
            class="block px-3 py-2 rounded-lg text-sm text-slate-300
               hover:bg-slate-800/60 hover:text-green-400 transition-colors
               font-medium"
               disabled
          >
            Analíticas
          </a>

          <a
            routerLink="/biblioteca"
            routerLinkActive="bg-slate-800/70 text-green-400 border-l-2 border-green-500"
            class="block px-3 py-2 rounded-lg text-sm text-slate-300
               hover:bg-slate-800/60 hover:text-green-400 transition-colors
               font-medium"
          >
            Todos los archivos
          </a>

          <a
            routerLink="/chat"
            routerLinkActive="bg-slate-800/70 text-green-400 border-l-2 border-green-500"
            class="block px-3 py-2 rounded-lg text-sm text-slate-300
               hover:bg-slate-800/60 hover:text-green-400 transition-colors
               font-medium"
          >
            Chatbot
          </a>
        </nav>

        <!-- Logout -->
        <div class="pt-4 border-t border-slate-700 mt-4">
          <button
            class="w-full text-sm font-medium rounded-lg px-4 py-2
               bg-green-600 hover:bg-green-500
               focus:outline-none focus:ring-2 focus:ring-green-500/60
               transition-all shadow-lg hover:shadow-green-600/30"
            (click)="logOut()"
          >
            Salir
          </button>
        </div>
      </aside>

      <!-- CONTENIDO PRINCIPAL -->
      <main
        class="flex-1 p-6 md:p-10 transition-all duration-500
           max-w-6xl mx-auto w-full"
      >
        <router-outlet />
      </main>
    </div>
  `,
})
export default class LayoutComponent {
  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  private _authState = inject(AuthStateService);
  private _router = inject(Router);

  async logOut() {
    await this._authState.logOut();
    this._router.navigateByUrl('/auth/sign-in');
  }
}
