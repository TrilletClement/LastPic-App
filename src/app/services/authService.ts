// services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Language } from '@ngx-translate/core';
import { ApiService } from './api';
import { AuthResponse, LoginRequest, User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private endpoint = '/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'lastpic_token';
  private userKey = 'lastpic_user';

  constructor(private api: ApiService) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const storedUser = localStorage.getItem(this.userKey);
    const token = localStorage.getItem(this.tokenKey);

    if (storedUser && token) {
      const userData = JSON.parse(storedUser);
      const user = new User(userData);
      this.currentUserSubject.next(user);
    }
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const loginRequest: LoginRequest = { username, password };

    const response = await firstValueFrom(
      this.api.post<AuthResponse>(`${this.endpoint}/login`, loginRequest)
    );

    const user = new User(response.user);

    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(user));

    this.currentUserSubject.next(user);

    return {
      token: response.token,
      user: user
    };
  }

  async register(
    username: string,
    password: string,
    email?: string,
    firstname?: string,
    lastname?: string
  ): Promise<User> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    if (email) formData.append('email', email);
    if (firstname) formData.append('firstname', firstname);
    if (lastname) formData.append('lastname', lastname);

    const response = await firstValueFrom(
      this.api.post<any>(`${this.endpoint}/register`, formData)
    );

    return new User(response);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  // Interceptor-like helper
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  async updateProfile(userUpdate: Partial<User>): Promise<User> {
    if (!this.getCurrentUser()) {
      throw new Error('Utilisateur non connecté');
    }

    const response = await firstValueFrom(
      this.api.put<any>(`/users/profile`, userUpdate, {
        headers: this.getAuthHeaders()
      })
    );

    const updatedUser = new User(response);

    localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
    this.currentUserSubject.next(updatedUser);

    return updatedUser;
  }

  async updateLanguage(language: Language): Promise<void> {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      // await this.updateProfile({ language });
    }
  }

  async validateToken(): Promise<boolean> { //Fonctionnais avant
    // const token = this.getToken();
    // if (!token) return false;

    // try {
    //   await firstValueFrom(
    //     this.api.get(`${this.endpoint}/validate`, {
    //       headers: this.getAuthHeaders()
    //     })
    //   );
    //   return true;
    // } catch {
    //   this.logout();
    //   return false;
    // }
    return true;
  }

  getUserDisplayName(): string {
    const user = this.getCurrentUser();
    if (!user) return '';
    return user.username;
  }

  getUserInitials(): string {
    const user = this.getCurrentUser();
    if (!user) return '';
   
    return user.username.slice(0, 2).toUpperCase();
  }
}
