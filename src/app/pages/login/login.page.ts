import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  username = '';
  password = '';
  errorMsg = '';

  constructor(private authService: AuthService) {}

  async login() {
    try {
      const token = await this.authService.login(this.username, this.password);
      console.log('JWT Token:', token);
    } catch (err: any) {
      console.error(err);
      this.errorMsg = 'LOGIN_FAILED';
    }
  }
}
