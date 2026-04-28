"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const BaseController_1 = require("./BaseController");
const zod_1 = require("zod");
const createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    category: zod_1.z.string(),
    priority: zod_1.z.enum(['low', 'medium', 'high', 'urgent']),
    location: zod_1.z.string(),
    coordinates: zod_1.z.object({ lat: zod_1.z.number(), lng: zod_1.z.number() }).optional(),
    description: zod_1.z.string(),
    volunteerCount: zod_1.z.number().int().positive(),
    deadline: zod_1.z.string(),
    requiredSkills: zod_1.z.array(zod_1.z.string()),
    photo: zod_1.z.string().optional(),
    checklist: zod_1.z
        .array(zod_1.z.object({
        id: zod_1.z.string().optional(),
        text: zod_1.z.string(),
        completed: zod_1.z.boolean(),
    }))
        .optional(),
});
class TaskController extends BaseController_1.BaseController {
    taskService;
    constructor(taskService) {
        super();
        this.taskService = taskService;
    }
    async create(req, res) {
        try {
            if (!req.user)
                throw new Error('Unauthorized');
            const validatedData = createTaskSchema.parse(req.body);
            // Get the NGO name from somewhere... For now, we expect it in the body loosely or passed as a header 
            // but ideally we'd fetch it from the User DB. For MVP mocking we allow it in body.
            const ngoName = req.body.ngoName || 'NGO Admin';
            const task = await this.taskService.createNewTask(req.user.uid, ngoName, validatedData);
            this.handleSuccess(res, task, 201);
        }
        catch (error) {
            this.handleError(error, res, 'createTask');
        }
    }
    async getAll(req, res) {
        try {
            const tasks = await this.taskService.fetchAllTasks();
            this.handleSuccess(res, tasks);
        }
        catch (error) {
            this.handleError(error, res, 'getAllTasks');
        }
    }
}
exports.TaskController = TaskController;
