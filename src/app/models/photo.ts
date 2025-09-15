import { Category } from "./category";
import { Group } from "./group";
import { PhotoLike } from "./photoLike";
import { User } from "./user";

// models/photo-status.enum.ts
export enum PhotoStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  IN_NEWS_FEED = 2
}

export class Photo {
  id: number = 0;
  filename: string = "";
  filePath: string = "";
  caption?: string;
  status: PhotoStatus = PhotoStatus.ACTIVE;
  postedAt?: Date;
  expiresAt?: Date;
  likeCount: number = 0;
  promotedToNewsFeedAt?: Date;

  // Relations
  author?: User;
  category?: Category;
  group?: Group;
  likes?: PhotoLike[] = [];

  // Propriétés calculées côté client
  isLiked?: boolean = false;

  constructor(obj?: Partial<Photo>) {
    if (obj) {
      this.id = obj.id ?? this.id;
      this.filename = obj.filename ?? this.filename;
      this.filePath = obj.filePath ?? this.filePath;
      this.caption = obj.caption ?? this.caption;
      this.status = obj.status ?? this.status;
      this.postedAt = obj.postedAt ? new Date(obj.postedAt) : this.postedAt;
      this.expiresAt = obj.expiresAt ? new Date(obj.expiresAt) : this.expiresAt;
      this.likeCount = obj.likeCount ?? this.likeCount;
      this.promotedToNewsFeedAt = obj.promotedToNewsFeedAt ? new Date(obj.promotedToNewsFeedAt) : this.promotedToNewsFeedAt;

      this.author = obj.author ? new User(obj.author) : this.author;
      this.category = obj.category ? new Category(obj.category) : this.category;
      this.group = obj.group ? new Group(obj.group) : this.group;
      this.likes = obj.likes?.map(l => new PhotoLike(l)) ?? this.likes;

      this.isLiked = obj.isLiked ?? this.isLiked;
    }
  }

  // Méthodes utilitaires comme en JPA
  get isActive(): boolean {
    return this.status === PhotoStatus.ACTIVE;
  }

  get isInNewsFeed(): boolean {
    return this.status === PhotoStatus.IN_NEWS_FEED;
  }

  get isInactive(): boolean {
    return this.status === PhotoStatus.INACTIVE;
  }

  get isExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  get imageUrl(): string {
    // Adapter selon ta config backend
    return `http://devct:8081/api/photos/files/${this.filename}`;
  }
}
