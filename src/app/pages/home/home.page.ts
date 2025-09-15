import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonRow,
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
  water
} from 'ionicons/icons';
import { AppHeaderComponent } from 'src/app/components/app-header/app-header.component';
import { User } from 'src/app/models/user';

interface Story {
  id: string;
  username: string;
  avatar: string;
  hasContent: boolean;
  contentCount: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonIcon

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  upcomingReminders: any[] = [];
  latestNews: any[] = [];
  recentConversations: any[] = [];
  unreadMessages = 0;
  availableServices: any[] = [];
  vehiclePhotos: { [vehicleId: string]: string } = {};

  userInfo: User | null = null;
  isLoading = true;

  // Stories state
  selectedStory: Story | null = null;
  cameraStream: MediaStream | null = null;
  capturedPhoto: string | null = null;

  stories: Story[] = [
    {
      id: '1',
      username: 'emma.johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b796?w=150&h=150&fit=crop&crop=face',
      hasContent: true,
      contentCount: 3
    },
    {
      id: '2',
      username: 'alex.photo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      hasContent: false,
      contentCount: 0
    },
    {
      id: '3',
      username: 'sarah.travels',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      hasContent: true,
      contentCount: 1
    },
    {
      id: '4',
      username: 'mike_fitness',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      hasContent: false,
      contentCount: 0
    },
    {
      id: '5',
      username: 'luna.art',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      hasContent: true,
      contentCount: 5
    },
    {
      id: '6',
      username: 'david.music',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      hasContent: false,
      contentCount: 0
    },
    {
      id: '7',
      username: 'zoe.food',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
      hasContent: true,
      contentCount: 2
    },
    {
      id: '8',
      username: 'tom.adventure',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face',
      hasContent: false,
      contentCount: 0
    }
  ];

  constructor(
    private navCtrl: NavController,
  ) {
    addIcons({
      carSport, location, heart, diamond,
      speedometer, calendar, flash, water, carSportOutline,
      add, newspaper, chatbubbles, construct, person, sync,
      car, settings, cog, trophy, warning, refresh, camera,
      close, images
    });
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void { }

  ionViewWillEnter() { }

  ngOnDestroy(): void {
    this.closeCamera();
  }

  // Sélectionner une story
  selectStory(story: any) {
    this.selectedStory = story;

    // Scroll simple vers l'élément sélectionné
    setTimeout(() => {
      const selected = document.querySelector('.story-item.selected');
      if (selected) {
        selected.scrollIntoView({
          behavior: 'smooth',
          inline: 'center'
        });
      }
    }, 100);
  }
  
  // Ouvrir la caméra
  async openCamera() {
    if (!this.selectedStory) return;

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

  // Ajouter la photo à la story
  addToStory() {
    if (!this.selectedStory || !this.capturedPhoto) return;

    console.log(`Ajout de la photo à: ${this.selectedStory.username}`);

    // Mettre à jour la story
    this.selectedStory.hasContent = true;
    this.selectedStory.contentCount++;

    // Reset
    this.capturedPhoto = null;

    // Feedback
    this.showSuccessMessage();
  }

  private showSuccessMessage() {
    console.log('✅ Photo ajoutée à la story avec succès!');
    // Ici tu peux ajouter un toast Ionic
    // const toast = await this.toastController.create({
    //   message: '📸 Photo ajoutée à la story!',
    //   duration: 2000,
    //   color: 'success'
    // });
    // toast.present();
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