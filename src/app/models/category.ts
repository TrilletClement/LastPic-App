import { Group } from "./group";
import { Photo } from "./photo";

export class Category {
  id: number = 0;
  name: string = "";
  createdAt?: Date;
  groupId: number = 0;
  group?: Group;
  photos?: Photo[] = [];

  constructor(obj?: Partial<Category>) {
    if (obj) {
      this.id = obj.id ?? this.id;
      this.name = obj.name ?? this.name;
      this.createdAt = obj.createdAt ? new Date(obj.createdAt) : this.createdAt;
      this.groupId = obj.groupId ?? this.groupId;
      this.group = obj.group ? new Group(obj.group) : this.group;
      this.photos = obj.photos?.map(p => new Photo(p)) ?? this.photos;
    }
  }

  get activePhoto(): Photo | undefined {
    return this.photos?.find(p => p.isActive);
  }

}
