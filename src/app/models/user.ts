import { Photo } from "./photo";
import { PhotoLike } from "./photoLike";
import { UserGroup } from "./userGroup";

// models/system-role.enum.ts
export enum SystemRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export class User {
  id: number = 0;
  username: string = "";
  email: string = "";
  password?: string;
  displayName?: string;
  profilePicture?: string;
  createdAt?: Date;
  isActive: boolean = true;

  // Rôles système
  systemRoles: SystemRole[] = [];

  // Relations
  photos?: Photo[] = [];
  photoLikes?: PhotoLike[] = [];
  groupMemberships?: UserGroup[] = [];


  constructor(obj?: Partial<User>) {
    if (obj) {
      this.id = obj.id ?? this.id;
      this.username = obj.username ?? this.username;
      this.email = obj.email ?? this.email;
      this.password = obj.password;
      this.displayName = obj.displayName ?? this.displayName;
      this.profilePicture = obj.profilePicture ?? this.profilePicture;
      this.createdAt = obj.createdAt ? new Date(obj.createdAt) : this.createdAt;
      this.isActive = obj.isActive ?? this.isActive;

      this.systemRoles = obj.systemRoles ?? this.systemRoles;
      this.photos = obj.photos?.map(p => new Photo(p)) ?? this.photos;
      this.groupMemberships = obj.groupMemberships?.map(g => new UserGroup(g)) ?? this.groupMemberships;
      this.photoLikes = obj.photoLikes?.map(like => new PhotoLike(like)) ?? this.photoLikes;
    }
  }

  get effectiveDisplayName(): string {
    return this.displayName && this.displayName.trim().length > 0
      ? this.displayName
      : this.username;
  }

  get isSystemAdmin(): boolean {
    return this.systemRoles?.includes(SystemRole.ADMIN) ?? false;
  }

}
export interface AuthResponse { token: string; user: User; }
export interface LoginRequest { username: string; password: string; }