export interface User {
  _id: string;
  name: string;
  password?: string;
  email?: string | undefined;
  picture?: string | undefined;
}

export type LogInUser = Pick<User, "name" | "password">;
export type SignUpUser = Pick<User, "email" | "name" | "password">;
