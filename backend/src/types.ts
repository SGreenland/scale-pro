// import settings from front end types
import { Settings } from "@scalemaestro/shared-types";
import { Prisma } from "@prisma/client";

export interface SignupRequestBody {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface SettingsRequestBody {
  settings: Settings;
}

export interface SettingsResponse {
  settings: Settings;
}

export interface SignupErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface LoginErrors {
  email?: string;
  password?: string;
}

export type UserWithSubscription = Prisma.UserGetPayload<{
  include: {
    subscription: true;
  };
}>;

