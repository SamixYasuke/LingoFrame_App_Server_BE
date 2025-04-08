import { Request } from "express";

export interface AuthenticatedRequest<Body = any, Params = any, Query = any>
  extends Request<Params, any, Body, Query> {
  user?: {
    user_id: string;
    email: string;
  };
  cookies: {
    accessToken?: string;
    refreshToken?: string;
  };
}
