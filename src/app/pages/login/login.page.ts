import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/authService';

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

  constructor(private authService: AuthService, private navCtrl: NavController) { }

  async login() {
    try {
      const response = await this.authService.login(this.username, this.password);
      console.log('JWT Token:', response.token);
      console.log('User info:', response.user);

      const isValid = await this.authService.validateToken();
      if (!isValid) {
        this.errorMsg = 'TOKEN_INVALID';
        return;
      }

      this.navCtrl.navigateRoot('/tabs/home');
    } catch (err: any) {
      console.error(err);
      this.errorMsg = 'LOGIN_FAILED';
    }
  }
}
