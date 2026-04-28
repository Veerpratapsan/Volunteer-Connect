// backend/src/routes/userRoutes.ts
import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { requireAuth } from '../middleware/authMiddleware';
import { asyncErrorWrapper } from '../utils/asyncErrorWrapper';

const router = Router();

// Dependency Injection manually setup for now
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post(
  '/profile',
  requireAuth,
  asyncErrorWrapper((req, res) => userController.createProfile(req, res))
);

router.get(
  '/profile/me',
  requireAuth,
  asyncErrorWrapper((req, res) => userController.getMyProfile(req, res))
);

export default router;
