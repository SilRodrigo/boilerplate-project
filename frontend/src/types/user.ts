export type UserType = 'ADMIN' | 'USER';

// Mirrors IUser from the backend (src/core/entities/user.ts)
export interface User {
  id: string;
  email: string;
  userType: UserType;
  createdAt: string;
  updatedAt: string;
}
