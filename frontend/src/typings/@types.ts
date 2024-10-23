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
  participants?: (string | UserType | undefined)[];
  messages: MessageType[];
  restricted: boolean;
  private: boolean;
  likes: number;
  createdAt: string;
  updatedAt: string;
  initiated_by?: UserType;
}

export interface MessageType {
  _id: string;
  content: string;
  sendee: UserType;
  room: RoomType;
  refBy?: string[];
  createdAt: string;
  updatedAt: string;
}

export type LogInUserType = Pick<UserType, "name" | "password">;
export type SignUpUserType = Pick<UserType, "email" | "name" | "password">;
