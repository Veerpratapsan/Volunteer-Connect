import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { TaskService } from '../services/TaskService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { z } from 'zod';

const createTaskSchema = z.object({
  title: z.string().min(3),
  category: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  location: z.string(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
  description: z.string(),
  volunteerCount: z.number().int().positive(),
  deadline: z.string(),
  requiredSkills: z.array(z.string()),
  photo: z.string().optional(),
  checklist: z
    .array(
      z.object({
        id: z.string().optional(),
        text: z.string(),
        completed: z.boolean(),
      })
    )
    .optional(),
});

export class TaskController extends BaseController {
  constructor(private taskService: TaskService) {
    super();
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) throw new Error('Unauthorized');
      
      const validatedData = createTaskSchema.parse(req.body);
      
      // Get the NGO name from somewhere... For now, we expect it in the body loosely or passed as a header 
      // but ideally we'd fetch it from the User DB. For MVP mocking we allow it in body.
      const ngoName = req.body.ngoName || 'NGO Admin';
      
      const task = await this.taskService.createNewTask(req.user.uid, ngoName, validatedData);
      
      this.handleSuccess(res, task, 201);
    } catch (error) {
      this.handleError(error, res, 'createTask');
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.taskService.fetchAllTasks();
      this.handleSuccess(res, tasks);
    } catch (error) {
      this.handleError(error, res, 'getAllTasks');
    }
  }
}
