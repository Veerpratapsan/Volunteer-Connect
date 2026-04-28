"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestService = void 0;
const RequestRepository_1 = require("../repositories/RequestRepository");
const TaskRepository_1 = require("../repositories/TaskRepository");
class RequestService {
    requestRepository = new RequestRepository_1.RequestRepository();
    taskRepository = new TaskRepository_1.TaskRepository();
    async createRequest(requestData) {
        return await this.requestRepository.createRequest(requestData);
    }
    async getAllRequests() {
        return await this.requestRepository.getAllRequests();
    }
    async getRequestById(requestId) {
        return await this.requestRepository.getRequestById(requestId);
    }
    async updateRequest(requestId, updateData, ngoUid) {
        const existing = await this.requestRepository.getRequestById(requestId);
        if (!existing) {
            throw new Error('NOT_FOUND: Request not found');
        }
        if (ngoUid) {
            const task = await this.taskRepository.getTaskById(String(existing.taskId));
            if (!task || task.ngoId !== ngoUid) {
                throw new Error('FORBIDDEN: You cannot update this request');
            }
        }
        return await this.requestRepository.updateRequest(requestId, updateData);
    }
    async deleteRequest(requestId) {
        return await this.requestRepository.deleteRequest(requestId);
    }
}
exports.RequestService = RequestService;
