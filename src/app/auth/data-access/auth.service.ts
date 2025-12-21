import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from '@angular/fire/firestore';

export interface Credentials {
  email: string;
  password: string;
}

export interface SignUpUser extends Credentials {
  firstName: string;
  lastName: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _auth = inject(Auth);
  private _firestore = inject(Firestore);

  async signUp(user: SignUpUser) {
    try {
      // Crear usuario en Firebase Auth
      const credential = await createUserWithEmailAndPassword(
        this._auth,
        user.email,
        user.password
      );

      const uid = credential.user.uid;
      console.log('[Auth] User created:', uid);

      // Crear documento en Firestore
      await setDoc(doc(this._firestore, 'users', uid), {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      console.log('[Firestore] User document created');

      return credential;
    } catch (error) {
      console.error('[AuthService.signUp] ERROR:', error);
      throw error;
    }
  }

  signIn(user: Credentials) {
    return signInWithEmailAndPassword(this._auth, user.email, user.password)
    .then(async (cred) => {
      const uid = cred.user.uid;

      const userRef = doc(this._firestore, `users/${uid}`);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await this._auth.signOut();
        throw new Error('Usuario no autorizado');
      }

      const role = userSnap.data()['role'];
      const isActive = userSnap.data()['active'];

      const allowed = (role === 'admin' || role === 'superadmin') && isActive;

      if (allowed) {
        return cred; // acceso permitido
      } else {
        await this._auth.signOut();
        throw new Error('No tienes permisos para acceder');
      }
    });
  }

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this._auth, provider);
  }
}
