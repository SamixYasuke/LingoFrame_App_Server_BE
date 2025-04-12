import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  // body: any;
  // params: any;
  // query: any;
  user?: {
    user_id?: string;
    email?: string;
  };
  cookies: {
    accessToken?: string;
    refreshToken?: string;
  };
}
