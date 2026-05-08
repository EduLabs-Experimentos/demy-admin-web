import {Injectable, signal} from '@angular/core';

@Injectable({providedIn: 'root'})
export class UserService {
  private readonly userRoleSignal = signal<string>('ADMIN');

  readonly userRole = this.userRoleSignal.asReadonly();

  setUserRole(role: string) {
    this.userRoleSignal.set(role);
    localStorage.setItem('userRole', role);
  }

  getUserRole(): string {
    return this.userRoleSignal();
  }

  clearUserData() {
    this.userRoleSignal.set('ADMIN');
  }
}
