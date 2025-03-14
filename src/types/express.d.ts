import { Request } from "express";

// declare global {
//   namespace Express {
//     interface Request {
//       user: {
//         user_id: string;
//         email: string;
//       };
//     }
//   }
// }

export interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    email: string;
  };
  cookies: {
    accessToken: string;
    refreshToken: string;
  };
}
