import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/unifiedConfig';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: 'Unauthorized: Missing or invalid token' });
      return;
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ success: false, error: 'Unauthorized: Token verification failed' });
    return;
  }
};
