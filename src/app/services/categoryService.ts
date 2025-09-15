// services/category.service.ts
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private endpoint = '/categories';

  constructor(private api: ApiService) {}

  async createCategory(groupId: number, name: string): Promise<Category> {
    const payload = { name, groupId };
    const response = await firstValueFrom(
      this.api.post<any>(this.endpoint, payload)
    );
    return new Category(response);
  }

  async getCategoriesByGroup(groupId: number): Promise<Category[]> {
    const response = await firstValueFrom(
      this.api.get<any[]>(`${this.endpoint}/group/${groupId}`)
    );
    return response.map(c => new Category(c));
  }

  // Méthodes utilitaires
  getDefaultCategories(): Category[] {
    return [
      new Category({ id: 0, name: 'Général', groupId: 0 }),
      new Category({ id: 0, name: 'Selfie', groupId: 0 }),
      new Category({ id: 0, name: 'Paysage', groupId: 0 }),
      new Category({ id: 0, name: 'Nourriture', groupId: 0 }),
      new Category({ id: 0, name: 'Animaux', groupId: 0 }),
      new Category({ id: 0, name: 'Sport', groupId: 0 }),
      new Category({ id: 0, name: 'Voyage', groupId: 0 })
    ];
  }
}
