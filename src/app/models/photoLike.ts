import { Photo } from "./photo";
import { User } from "./user";

export class PhotoLike {
  id: number = 0;
  photo?: Photo;
  user?: User;
  likedAt?: Date;

  constructor(obj?: Partial<PhotoLike>) {
    if (obj) {
      this.id = obj.id ?? this.id;
      this.photo = obj.photo ? new Photo(obj.photo) : this.photo;
      this.user = obj.user ? new User(obj.user) : this.user;
      this.likedAt = obj.likedAt ? new Date(obj.likedAt) : this.likedAt;
    }
  }
}