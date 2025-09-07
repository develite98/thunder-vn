// firebase.service.ts
import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;

  public init(config: Record<string, string>) {
    if (!this.app) {
      this.app = initializeApp(config);
      this.auth = getAuth(this.app);

      console.log('Firebase initialized dynamically ✅');
    }
  }

  public getAuth(): Auth {
    if (!this.auth) throw new Error('Firebase not initialized yet!');
    return this.auth;
  }

  public async loginWithGoogle(): Promise<User | null> {
    try {
      const auth = this.getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err) {
      console.error('Google login failed:', err);
      return null;
    }
  }
}
