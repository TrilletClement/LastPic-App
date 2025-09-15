import { Component, Input } from '@angular/core';
import { IonAvatar, IonButtons, IonHeader, IonTitle, IonToolbar, MenuController } from "@ionic/angular/standalone";

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  standalone: true,
  imports: [ IonAvatar, IonButtons, IonToolbar, IonTitle, IonHeader],
})
export class AppHeaderComponent {
  @Input() title = 'LastPic';
  
  constructor(private menuCtrl: MenuController) { }

  getInitials() {
    return 'CT';
  }

  openProfile() {
    console.log('Open profile menu');
    this.menuCtrl.enable(true, 'profile-menu');
    this.menuCtrl.open('profile-menu');
  }
}