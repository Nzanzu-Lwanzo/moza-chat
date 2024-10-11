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
  participants?: string;
  restricted: boolean;
  private: boolean;
  likes: number;
  createdAt: string;
  updatedAt: true;
}

export type LogInUserType = Pick<UserType, "name" | "password">;
export type SignUpUserType = Pick<UserType, "email" | "name" | "password">;
