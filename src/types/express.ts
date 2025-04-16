import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    user_id?: string;
    email?: string;
  };
  cookies: {
    accessToken?: string;
    refreshToken?: string;
  };
  body: any;
  params: any;
  query: any;
  ip: string;
}
