// services/group.service.ts
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';
import { Group } from '../models/group';
import { Photo } from '../models/photo';
import { UserGroup } from '../models/userGroup';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private endpoint = '/groups';

  constructor(private api: ApiService) {}

  async createGroup(name: string): Promise<Group> {
    const payload = { name };
    const response = await firstValueFrom(
      this.api.post<any>(this.endpoint, payload)
    );
    return new Group(response);
  }

  async addUserToGroup(groupId: number, userId: number): Promise<UserGroup> {
    const response = await firstValueFrom(
      this.api.post<any>(`${this.endpoint}/${groupId}/users/${userId}`, {})
    );
    return new UserGroup(response);
  }

  async getUsersInGroup(groupId: number): Promise<UserGroup[]> {
    const response = await firstValueFrom(
      this.api.get<any[]>(`${this.endpoint}/${groupId}/users`)
    );
    return response.map(userGroup => new UserGroup(userGroup));
  }

  async getGroupFeed(groupId: number): Promise<Photo[]> {
    const response = await firstValueFrom(
      this.api.get<any[]>(`${this.endpoint}/${groupId}/feed`)
    );
    return response.map(photo => new Photo(photo));
  }

  async getUserGroups(userId: number): Promise<Group[]> {
    const response = await firstValueFrom(
      this.api.get<any[]>(`/users/${userId}/groups`)
    );
    return response.map(group => new Group(group));
  }
}
