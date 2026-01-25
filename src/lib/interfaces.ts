
export interface LoginData {
  username: string;
  password: string;
  saveme: boolean;
}

export interface ChangePassData {
  old_pass: string;
  new_pass: string;
}

export interface ExtChangePassData {
  new_pass: string;
  token: string;
  user_id: string;
}

export interface VerificationData {
  userId: string;
  token: string;
}

export interface ResendData {
  email: string;
}

export interface RegistrationData {
  username: string;
  email: string;
  password: string;
}