import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import {
  IonButton,
  IonIcon,
  NavController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  calendar,
  camera,
  car,
  carSport,
  carSportOutline,
  chatbubbles,
  close,
  cog,
  construct,
  diamond,
  flash,
  heart,
  images,
  location,
  newspaper,
  person,
  refresh,
  settings,
  speedometer,
  sync,
  trophy,
  warning,
  water, alertCircleOutline
} from 'ionicons/icons';
import { Group } from 'src/app/models/group';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/authService';
import { GroupService } from 'src/app/services/groupService';
import { PhotoService } from 'src/app/services/photoService';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonIcon
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnDestroy, AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  upcomingReminders: any[] = [];
  latestNews: any[] = [];
  recentConversations: any[] = [];
  unreadMessages = 0;
  availableServices: any[] = [];
  vehiclePhotos: { [vehicleId: string]: string } = {};

  userInfo: User | null = null;
  isLoading = true;

  userGroups: Group[] = [];
  selectedGroup: Group | null = null;
  cameraStream: MediaStream | null = null;
  capturedPhoto: string | null = null;

  constructor(
    private navCtrl: NavController,
    private groupService: GroupService,
    private photoService: PhotoService,
    private authService: AuthService
  ) {
    addIcons({ alertCircleOutline, camera, close, refresh, add, images, carSport, location, heart, diamond, speedometer, calendar, flash, water, carSportOutline, newspaper, chatbubbles, construct, person, sync, car, settings, cog, trophy, warning });
  }

  ngAfterViewInit(): void { }

  ionViewWillEnter() {
    this.loadUserGroups();
  }

  ngOnDestroy(): void {
    this.closeCamera();
  }

  async loadUserGroups() {
    try {
      const currentUser = await this.authService.getCurrentUser();
      if (currentUser?.id) {
        this.userGroups = await this.groupService.getMyGroups();
        console.log('Groupes chargés:', this.userGroups);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des groupes:', error);
    }
  }

  // Sélectionner un groupe
  selectGroup(group: Group) {
    this.selectedGroup = group;

    // Scroll simple vers l'élément sélectionné
    setTimeout(() => {
      const selected = document.querySelector('.group-item.selected');
      if (selected) {
        selected.scrollIntoView({
          behavior: 'smooth',
          inline: 'center'
        });
      }
    }, 100);
  }

  // Obtenir l'avatar du groupe (dernière photo ou avatar par défaut)
  getGroupAvatar(group: Group): string {
    if (group.photos && group.photos.length > 0) {
      // Trouve la dernière photo active
      const activePhotos = group.photos
        .filter(p => p.isActive)
        .sort((a, b) => {
          const dateA = a.postedAt ? new Date(a.postedAt).getTime() : 0;
          const dateB = b.postedAt ? new Date(b.postedAt).getTime() : 0;
          return dateB - dateA;
        });

      if (activePhotos.length > 0) {
        return activePhotos[0].imageUrl;
      }
    }
    return '/assets/icon/default-group-avatar.png';
  }

  // Ouvrir la caméra
  async openCamera() {
    if (!this.selectedGroup) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      this.cameraStream = stream;

      setTimeout(() => {
        if (this.videoElement?.nativeElement) {
          this.videoElement.nativeElement.srcObject = stream;
        }
      }, 100);

    } catch (error) {
      console.error('Erreur caméra:', error);
      alert('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
    }
  }

  isGroupViewed(group: any): boolean {
    return this.getPhotoCount(group) === 0;
  }

  // Fermer la caméra
  closeCamera() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
  }

  // Capturer une photo
  capturePhoto() {
    if (!this.videoElement?.nativeElement || !this.cameraStream) return;

    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.capturedPhoto = canvas.toDataURL('image/jpeg', 0.8);
      this.closeCamera();
      console.log('Photo capturée!');
    }
  }

  // Reprendre une photo
  retakePhoto() {
    this.capturedPhoto = null;
    this.openCamera();
  }

  // Ajouter la photo au groupe
  async addToGroup() {
    if (!this.selectedGroup || !this.capturedPhoto) return;

    try {
      const currentUser = await this.authService.getCurrentUser();
      if (!currentUser?.id) {
        alert('Utilisateur non connecté');
        return;
      }

      // Convertir base64 en blob pour l'upload
      const response = await fetch(this.capturedPhoto);
      const blob = await response.blob();

      // Générer un nom de fichier unique
      const filename = `group_${this.selectedGroup.id}_${Date.now()}.jpg`;

      // Ici tu peux implémenter l'upload du fichier selon ton backend
      // const uploadedFilePath = await this.uploadFile(blob, filename);

      // Pour l'instant, on utilise le base64 comme filePath (à adapter)
      const newPhoto = await this.photoService.postPhoto(
        currentUser.id,
        filename,
        this.capturedPhoto, // En réalité ce serait uploadedFilePath
        `Photo ajoutée au groupe ${this.selectedGroup.name}`
      );

      console.log(`Photo ajoutée au groupe: ${this.selectedGroup.name}`, newPhoto);

      // Refresh les groupes pour mettre à jour l'UI
      await this.loadUserGroups();

      // Reset
      this.capturedPhoto = null;
      this.selectedGroup = null;

      // Feedback
      this.showSuccessMessage();

    } catch (error) {
      console.error('Erreur lors de l\'ajout de la photo:', error);
      alert('Erreur lors de l\'ajout de la photo');
    }
  }

  private showSuccessMessage() {
    console.log('✅ Photo ajoutée au groupe avec succès!');
    // Ici tu peux ajouter un toast Ionic
    // const toast = await this.toastController.create({
    //   message: '📸 Photo ajoutée au groupe!',
    //   duration: 2000,
    //   color: 'success'
    // });
    // toast.present();
  }

  // Méthodes utilitaires pour l'affichage
  hasPhotos(group: Group): boolean {
    return group.photos ? group.photos.length > 0 : false;
  }

  getPhotoCount(group: Group): number {
    return group.photos ? group.photos.filter(p => p.isActive).length : 0;
  }

  // Méthodes existantes héritées
  getInitials(): void { }

  openProfile() {
    this.navCtrl.navigateForward('/profile');
  }

  openGarage() {
    this.navCtrl.navigateForward('tabs/garage');
  }

  openVehicleDetails() { }

  formatBirthYear(): string {
    return '';
  }

  getMemberSince(): void { }

  openReminders() { }

  openNews() { }

  openConversations() { }

  openServices() { }
}