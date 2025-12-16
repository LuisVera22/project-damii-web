import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListadoArchivosResponse } from '../features/library-list/library-list';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DriveService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getArchivos(folderId?: string, pageToken?: string): Observable<ListadoArchivosResponse> {
    let params = new HttpParams();

    if (folderId) {
      params = params.set('folderId', folderId);
    }
    if (pageToken) {
      params = params.set('pageToken', pageToken);
    }

    return this.http.get<ListadoArchivosResponse>(`${this.baseUrl}/api/archivos`, { params });
  }
}
