"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const crypto_1 = require("crypto");
const DEFAULT_TASK_PHOTO = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80';
function normalizeChecklist(checklist) {
    if (!Array.isArray(checklist))
        return [];
    return checklist.map((item) => ({
        id: typeof item?.id === 'string' && item.id ? item.id : (0, crypto_1.randomUUID)(),
        text: String(item?.text ?? ''),
        completed: Boolean(item?.completed),
    }));
}
class TaskService {
    taskRepository;
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async createNewTask(ngoId, ngoName, taskData) {
        const photo = typeof taskData.photo === 'string' && taskData.photo.trim().length > 0
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
    async getTask(taskId) {
        const task = await this.taskRepository.getTaskById(taskId);
        if (!task)
            throw new Error('NOT_FOUND: Task not found');
        return task;
    }
}
exports.TaskService = TaskService;
