import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/authService';
import { CategoryService } from 'src/app/services/categoryService';
import { GroupService } from 'src/app/services/groupService';
import { PhotoService } from 'src/app/services/photoService';
import { Category } from 'src/app/models/category';
import { Group } from 'src/app/models/group';
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-post-photo',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './post-photo.page.html',
  styleUrls: ['./post-photo.page.scss']
})
export class PostPhotoPage implements OnInit {
  imageUri: string = '';
  caption: string = '';
  selectedGroupId?: number;
  selectedCategoryId?: number;
  groups: Group[] = [];
  categories: Category[] = [];
  isLoading = false;
  currentUser?: User;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private photoService: PhotoService,
    private groupService: GroupService,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    // this.currentUser = this.authService.getCurrentUser();
    
    // Récupérer l'URI de l'image depuis les paramètres
    this.route.queryParams.subscribe(params => {
      this.imageUri = params['imageUri'] || '';
      if (params['groups']) {
        try {
          const groupsData = JSON.parse(params['groups']);
          this.groups = groupsData.map((g: any) => new Group(g));
        } catch (e) {
          console.error('Erreur parsing groups:', e);
        }
      }
    });

    if (this.groups.length === 0 && this.currentUser) {
      await this.loadUserGroups();
    }
  }

  async loadUserGroups() {
    if (!this.currentUser) return;
    
    try {
      this.groups = await this.groupService.getUserGroups(this.currentUser.id);
    } catch (error) {
      console.error('Erreur chargement groupes:', error);
    }
  }

  async onGroupChange() {
    if (!this.selectedGroupId) {
      this.categories = [];
      return;
    }

    try {
      this.categories = await this.categoryService.getCategoriesByGroup(this.selectedGroupId);
      // Ajouter les catégories par défaut si le groupe n'en a pas
      if (this.categories.length === 0) {
        this.categories = this.categoryService.getDefaultCategories();
      }
      this.selectedCategoryId = undefined;
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
      this.categories = this.categoryService.getDefaultCategories();
    }
  }

  async postPhoto() {
    if (!this.currentUser || !this.imageUri || !this.selectedGroupId || !this.selectedCategoryId) {
      this.showAlert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.isLoading = true;

    try {
      // Simuler l'upload du fichier (dans un vrai projet, vous uploaderiez le fichier)
      const filename = `photo_${Date.now()}.jpg`;
      const filePath = `uploads/${this.currentUser.id}/${filename}`;
      
      // Poster la photo
      await this.photoService.postPhoto(
        this.currentUser.id,
        filename,
        filePath,
        this.caption
      );

      this.showAlert('Succès', 'Photo partagée avec succès!');
      this.navCtrl.navigateRoot('/home');
      
    } catch (error) {
      console.error('Erreur post photo:', error);
      this.showAlert('Erreur', 'Impossible de partager la photo');
    } finally {
      this.isLoading = false;
    }
  }

  async createNewGroup() {
    const alert = await this.alertController.create({
      header: 'Créer un nouveau groupe',
      inputs: [
        {
          name: 'groupName',
          type: 'text',
          placeholder: 'Nom du groupe'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Créer',
          handler: async (data) => {
            if (data.groupName) {
              try {
                const newGroup = await this.groupService.createGroup(data.groupName);
                this.groups.push(newGroup);
                this.selectedGroupId = newGroup.id;
                await this.onGroupChange();
              } catch (error) {
                console.error('Erreur création groupe:', error);
                this.showAlert('Erreur', 'Impossible de créer le groupe');
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async createNewCategory() {
    if (!this.selectedGroupId) {
      this.showAlert('Erreur', 'Veuillez d\'abord sélectionner un groupe');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Créer une nouvelle catégorie',
      inputs: [
        {
          name: 'categoryName',
          type: 'text',
          placeholder: 'Nom de la catégorie'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Créer',
          handler: async (data) => {
            if (data.categoryName) {
              try {
                const newCategory = await this.categoryService.createCategory(
                  this.selectedGroupId!,
                  data.categoryName
                );
                this.categories.push(newCategory);
                this.selectedCategoryId = newCategory.id;
              } catch (error) {
                console.error('Erreur création catégorie:', error);
                this.showAlert('Erreur', 'Impossible de créer la catégorie');
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  goBack() {
    this.navCtrl.back();
  }
}