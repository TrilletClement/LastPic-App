import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private endpoint = '/auth';

  constructor(private api: ApiService) {}

  async login(username: string, password: string): Promise<string> {
    const res = await firstValueFrom(
      this.api.post<{ token: string }>(`${this.endpoint}/login`, { username, password })
    );
    return res.token;
  }

  async register(username: string, password: string): Promise<void> {
    await firstValueFrom(
      this.api.post<void>(`${this.endpoint}/register`, { username, password })
    );
  }
}
