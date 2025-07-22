import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        user_id: string;
        email: string;
        role: string;
      };
    }
  }
}
