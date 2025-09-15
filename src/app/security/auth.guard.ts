import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/authService';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    if (this.authService.isLoggedIn()) {
      // Vérifier si le token est encore valide
      const isValid = await this.authService.validateToken();
      if (isValid) {
        return true;
      }
    }
    
    // Rediriger vers la page de connexion
    this.router.navigate(['/login']);
    return false;
  }
}