import { Category } from "./category";
import { Photo } from "./photo";
import { UserGroup } from "./userGroup";

export class Group {
  id: number = 0;
  name: string = "";
  createdAt?: Date;
  description?: string;
  categories?: Category[] = [];
  photos?: Photo[] = [];
  members?: UserGroup[] = [];

  constructor(obj?: Partial<Group>) {
    if (obj) {
      this.id = obj.id ?? this.id;
      this.name = obj.name ?? this.name;
      this.createdAt = obj.createdAt ? new Date(obj.createdAt) : this.createdAt;
      this.description = obj.description ?? this.description;
      this.categories = obj.categories?.map(c => new Category(c)) ?? this.categories;
      this.photos = obj.photos?.map(p => new Photo(p)) ?? this.photos;
      this.members = obj.members?.map(m => new UserGroup(m)) ?? this.members;
    }
  }

  get memberCount(): number {
    return this.members?.length ?? 0;
  }

  get activePhotosCount(): Photo | undefined {
    return this.photos?.find(p => p.isActive);
  }


}