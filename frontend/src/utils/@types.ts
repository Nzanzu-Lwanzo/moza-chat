export interface UserType {
  _id: string;
  name: string;
  password?: string;
  email?: string | undefined;
  picture?: string | undefined;
}

export interface RoomType {
  _id: string;
  name: string;
  description: string;
  picture?: string;
  participants?: (string | undefined)[];
  restricted: boolean;
  private: boolean;
  likes: number;
  createdAt: string;
  updatedAt: true;
  initiated_by?: UserType;
}

export type LogInUserType = Pick<UserType, "name" | "password">;
export type SignUpUserType = Pick<UserType, "email" | "name" | "password">;
