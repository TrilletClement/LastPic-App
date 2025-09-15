import { Group } from "./group";
import { User } from "./user";

export class UserGroup {
  userId: number = 0;
  groupId: number = 0;
  user?: User;
  group?: Group;
  role: string = "MEMBER";
  isActive: boolean = true;
  joinedAt?: Date;

  constructor(obj?: Partial<UserGroup>) {
    if (obj) {
      this.userId = obj.userId ?? this.userId;
      this.groupId = obj.groupId ?? this.groupId;
      this.user = obj.user ? new User(obj.user) : this.user;
      this.group = obj.group ? new Group(obj.group) : this.group;
      this.role = obj.role ?? this.role;
      this.isActive = obj.isActive ?? this.isActive;
      this.joinedAt = obj.joinedAt ? new Date(obj.joinedAt) : this.joinedAt;
    }
  }

  get isOwner(): boolean {
    return this.role === "OWNER" && this.isActive;
  }

  get canManageGroup(): boolean {
    return (this.role === "OWNER" || this.role === "ADMIN") && this.isActive;
  }

  get canModerate(): boolean {
    return (this.role === "OWNER" || this.role === "ADMIN" || this.role === "MODERATOR") && this.isActive;
  }
}
