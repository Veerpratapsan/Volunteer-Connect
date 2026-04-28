// backend/src/controllers/UserController.ts
import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { UserService } from '../services/UserService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { z } from 'zod';

const createUserSchema = z.object({
  role: z.enum(['ngo', 'volunteer']),
  name: z.string().min(2),
  phone: z.string().optional(),
  address: z.string().optional(),
  skills: z.array(z.string()).optional(),
  description: z.string().optional(),
  uniqueId: z.string().optional(),
});

export class UserController extends BaseController {
  constructor(private userService: UserService) {
    super();
  }

  async createProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) throw new Error('Unauthorized');
      
      const validatedData = createUserSchema.parse(req.body);
      const user = await this.userService.createUserProfile(
        req.user.uid,
        req.user.email || '',
        validatedData.role,
        validatedData
      );
      
      this.handleSuccess(res, user, 201);
    } catch (error) {
      this.handleError(error, res, 'createUserProfile');
    }
  }

  async getMyProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) throw new Error('Unauthorized');
      const user = await this.userService.getProfile(req.user.uid);
      this.handleSuccess(res, user);
    } catch (error) {
      this.handleError(error, res, 'getMyProfile');
    }
  }
}
