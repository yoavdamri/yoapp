import { inject, Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  authState,
  user,
  User
} from '@angular/fire/auth';
import { Observable, from, of, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  currentUser$ = user(this.auth);
  isAuthenticated$ = authState(this.auth).pipe(map(user => !!user));

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  register(email: string, password: string, displayName: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(({ user }) => {
        return from(updateProfile(user, { displayName }));
      })
    );
  }

  loginWithGoogle(): Observable<UserCredential> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      switchMap(() => {
        this.router.navigate(['/login']);
        return of(undefined);
      })
    );
  }

  resetPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  updateUserProfile(displayName: string, photoURL?: string): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) return throwError(() => new Error('No authenticated user found'));

    return from(updateProfile(user, { displayName, photoURL }));
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}
