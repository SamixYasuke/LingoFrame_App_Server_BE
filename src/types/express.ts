// import { Request } from "express";

// export interface AuthenticatedRequest extends Request {
//   body: any;
//   params: any;
//   query: any;
//   user?: {
//     user_id?: string;
//     email?: string;
//   };
//   cookies: {
//     accessToken?: string;
//     refreshToken?: string;
//   };
// }
import { Request } from "express";

// Extend the base Express Request type to include 'user' and retain other properties like 'ip'.
export interface AuthenticatedRequest extends Request {
  user?: {
    user_id?: string;
    email?: string;
  };
  cookies: {
    accessToken?: string;
    refreshToken?: string;
  };
}
