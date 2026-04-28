import { RequestRepository } from '../repositories/RequestRepository';
import { TaskRepository } from '../repositories/TaskRepository';

export class RequestService {
  private requestRepository = new RequestRepository();
  private taskRepository = new TaskRepository();

  async createRequest(requestData: any) {
    return await this.requestRepository.createRequest(requestData);
  }

  async getAllRequests() {
    return await this.requestRepository.getAllRequests();
  }

  async getRequestById(requestId: string) {
    return await this.requestRepository.getRequestById(requestId);
  }

  async updateRequest(requestId: string, updateData: any, ngoUid?: string) {
    const existing = await this.requestRepository.getRequestById(requestId);
    if (!existing) {
      throw new Error('NOT_FOUND: Request not found');
    }
    if (ngoUid) {
      const task = await this.taskRepository.getTaskById(String((existing as any).taskId));
      if (!task || (task as any).ngoId !== ngoUid) {
        throw new Error('FORBIDDEN: You cannot update this request');
      }
    }
    return await this.requestRepository.updateRequest(requestId, updateData);
  }

  async deleteRequest(requestId: string) {
    return await this.requestRepository.deleteRequest(requestId);
  }
}
