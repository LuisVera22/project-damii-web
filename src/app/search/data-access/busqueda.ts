import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BusquedaRequest, BusquedaResponse } from '../features/chat/chat';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Busqueda {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  buscar(query: string): Observable<BusquedaResponse> {
    const body: BusquedaRequest = { query };
    return this.http.post<BusquedaResponse>(
      `${this.baseUrl}/api/buscar`,
      body
    );
  }
}
