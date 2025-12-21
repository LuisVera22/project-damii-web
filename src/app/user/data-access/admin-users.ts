import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'superadmin';
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AdminUsersService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private _fs = inject(Firestore);

  createUser(payload: CreateUserPayload) {
    return this.http.post<{ ok: boolean; uid: string }>(
      `${this.baseUrl}/api/admin/users`,
      payload
    );
  }

  setActive(userId: string, active: boolean) {
    const ref = doc(this._fs, `users/${userId}`);
    return updateDoc(ref, { active });
  }
}
