import { randomUUID } from 'crypto';
import { TaskRepository } from '../repositories/TaskRepository';

const DEFAULT_TASK_PHOTO =
  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80';

function normalizeChecklist(checklist: unknown): { id: string; text: string; completed: boolean }[] {
  if (!Array.isArray(checklist)) return [];
  return checklist.map((item: any) => ({
    id: typeof item?.id === 'string' && item.id ? item.id : randomUUID(),
    text: String(item?.text ?? ''),
    completed: Boolean(item?.completed),
  }));
}

export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  async createNewTask(ngoId: string, ngoName: string, taskData: any) {
    const photo =
      typeof taskData.photo === 'string' && taskData.photo.trim().length > 0
        ? taskData.photo
        : DEFAULT_TASK_PHOTO;

    const newTask = {
      ...taskData,
      photo,
      checklist: normalizeChecklist(taskData.checklist),
      ngoId,
      ngoName,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    return await this.taskRepository.createTask(newTask);
  }

  async fetchAllTasks() {
    return await this.taskRepository.getAllTasks();
  }

  async getTask(taskId: string) {
    const task = await this.taskRepository.getTaskById(taskId);
    if (!task) throw new Error('NOT_FOUND: Task not found');
    return task;
  }
}
