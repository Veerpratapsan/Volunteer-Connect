import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { TaskService } from '../services/TaskService';
import { TaskRepository } from '../repositories/TaskRepository';
import { requireAuth } from '../middleware/authMiddleware';
import { asyncErrorWrapper } from '../utils/asyncErrorWrapper';

const router = Router();

const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

router.get(
  '/',
  asyncErrorWrapper((req, res) => taskController.getAll(req, res))
);

router.post(
  '/',
  requireAuth,
  asyncErrorWrapper((req, res) => taskController.create(req, res))
);

export default router;
