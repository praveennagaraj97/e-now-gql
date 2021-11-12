export interface CreateUserInputType {
  userName: string;
  email: string;
  password: string;
}

export interface FindOnyByUserNameAndPasswordInputType {
  userName: string;
  password: string;
}

export interface FindOnyByEmailAndPasswordInputType {
  email: string;
  password: string;
}

export interface UpdatePasswordInputType {
  currentPassword: string;
  newPassword: string;
  id: string;
}
