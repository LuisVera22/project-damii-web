import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Kpis {
  totalBusquedas: number;
  totalDocumentos: number;
  usuariosUnicos: number;
}

export interface BusquedaPorDia {
  dia: string;
  total: number;
}

export interface DocumentoPopular {
  titulo: string;
  total: number;
}

export interface UltimaBusqueda {
  usuario: string;
  original: string;
  search_phrase: string;
  fecha: string;
}

export interface DashboardResponse {
  kpis: Kpis;
  busquedasPorDia: BusquedaPorDia[];
  documentosPopulares: DocumentoPopular[];
  ultimasBusquedas: UltimaBusqueda[];
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(`${this.baseUrl}/api/dashboard`);
  }
}
