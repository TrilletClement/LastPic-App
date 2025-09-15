// services/group.service.ts
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';
import { Group } from '../models/group';
import { UserGroup } from '../models/userGroup';
import { AuthService } from './authService';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private endpoint = '/groups';

  constructor(
    private api: ApiService,
    private authService: AuthService
  ) {}

  // Récupérer les groupes de l'utilisateur connecté
  async getMyGroups(): Promise<Group[]> {
    const response = await firstValueFrom(
      this.api.get<any[]>(`${this.endpoint}/my-groups`, {
        headers: this.authService.getAuthHeaders()
      })
    );
    return response.map(group => new Group(group));
  }

  // Créer un nouveau groupe
  async createGroup(name: string): Promise<Group> {
    const payload = { name };
    const response = await firstValueFrom(
      this.api.post<any>(this.endpoint, payload, {
        headers: this.authService.getAuthHeaders()
      })
    );
    return new Group(response);
  }

  // Rejoindre un groupe
  async joinGroup(groupId: number): Promise<UserGroup> {
    const response = await firstValueFrom(
      this.api.post<any>(`${this.endpoint}/${groupId}/join`, {}, {
        headers: this.authService.getAuthHeaders()
      })
    );
    return new UserGroup(response);
  }

  // Quitter un groupe
  async leaveGroup(groupId: number): Promise<void> {
    return firstValueFrom(
      this.api.delete<void>(`${this.endpoint}/${groupId}/leave`, {
        headers: this.authService.getAuthHeaders()
      })
    );
  }

  // Récupérer le feed d'un groupe
  async getGroupFeed(groupId: number): Promise<any> {
    const response = await firstValueFrom(
      this.api.get<any>(`${this.endpoint}/${groupId}/feed`, {
        headers: this.authService.getAuthHeaders()
      })
    );
    return response;
  }

  // Récupérer les membres d'un groupe
  async getGroupMembers(groupId: number): Promise<any[]> {
    const response = await firstValueFrom(
      this.api.get<any[]>(`${this.endpoint}/${groupId}/members`, {
        headers: this.authService.getAuthHeaders()
      })
    );
    return response;
  }

  // Rechercher des groupes
  async searchGroups(query: string): Promise<Group[]> {
    const response = await firstValueFrom(
      this.api.get<any[]>(`${this.endpoint}/search`, {
        params: { query },
        headers: this.authService.getAuthHeaders()
      })
    );
    return response.map(group => new Group(group));
  }

  // Mettre à jour un groupe
  async updateGroup(groupId: number, updates: { name?: string, description?: string }): Promise<Group> {
    const response = await firstValueFrom(
      this.api.put<any>(`${this.endpoint}/${groupId}`, updates, {
        headers: this.authService.getAuthHeaders()
      })
    );
    return new Group(response);
  }

  // Supprimer un groupe
  async deleteGroup(groupId: number): Promise<void> {
    return firstValueFrom(
      this.api.delete<void>(`${this.endpoint}/${groupId}`, {
        headers: this.authService.getAuthHeaders()
      })
    );
  }
}