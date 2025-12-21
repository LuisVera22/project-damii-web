import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  active?: boolean;
  createdAt?: any;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private _firestore = inject(Firestore);

  getUsers(): Observable<User[]> {
    const usersRef = collection(this._firestore, 'users');
    return collectionData(usersRef, { idField: 'id' }) as Observable<User[]>;
  }
}
