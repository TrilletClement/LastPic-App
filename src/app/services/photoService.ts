// services/photo.service.ts
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Photo } from '../models/photo'; // Corrigé l'import
import { ApiService } from './api';
import { AuthService } from './authService';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private endpoint = '/photos';

  constructor(
    private api: ApiService,
    private authService: AuthService
  ) {}

  async postPhoto(
    userId: number,
    filename: string,
    filePath: string,
    caption?: string
  ): Promise<Photo> {
    const payload: any = {
      userId,
      filename,
      filePath,
    };

    if (caption) {
      payload.caption = caption;
    }

    const response = await firstValueFrom(
      this.api.post<any>(this.endpoint, payload, {
        headers: this.authService.getAuthHeaders()
      })
    );
    return new Photo(response);
  }

  async likePhoto(photoId: number, userId: number): Promise<void> {
    const payload = { userId };
    return firstValueFrom(
      this.api.post<void>(`${this.endpoint}/${photoId}/like`, payload, {
        headers: this.authService.getAuthHeaders()
      })
    );
  }

  async getActivePhotos(): Promise<Photo[]> {
    const response = await firstValueFrom(
      this.api.get<any[]>(`${this.endpoint}/active`, {
        headers: this.authService.getAuthHeaders()
      })
    );
    return response.map(photo => new Photo(photo));
  }

  async getGroupActivePhotos(groupId: number): Promise<Photo[]> {
    try {
      const response = await firstValueFrom(
        this.api.get<any[]>(`${this.endpoint}/group/${groupId}/active`, {
          headers: this.authService.getAuthHeaders()
        })
      );
      return response.map(photo => new Photo(photo));
    } catch (error) {
      console.error('Error fetching group active photos:', error);
      throw error;
    }
  }

  async getTodayTopLikes(): Promise<Photo[]> {
    const response = await firstValueFrom(
      this.api.get<any[]>(`${this.endpoint}/today/top`, {
        headers: this.authService.getAuthHeaders()
      })
    );
    return response.map(photo => new Photo(photo));
  }

  // Méthodes utilitaires
  getImageUrl(photo: Photo): string {
    return photo.imageUrl;
  }

  isPhotoActive(photo: Photo): boolean {
    return photo.isActive && !photo.isExpired;
  }
}