import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { RequestService } from '../services/RequestService';
import { UserRepository } from '../repositories/UserRepository';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class RequestController extends BaseController {
  private requestService = new RequestService();
  private userRepository = new UserRepository();

  async createRequest(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user?.uid) throw new Error('Unauthorized');

      const volunteer = await this.userRepository.getUserById(authReq.user.uid);
      const volunteerSkills = Array.isArray((volunteer as any)?.skills) ? (volunteer as any).skills : [];
      const volunteerName =
        (typeof (volunteer as any)?.name === 'string' && (volunteer as any).name) ||
        authReq.user.email?.split('@')[0] ||
        'Volunteer';

      const merged = {
        ...req.body,
        volunteerId: authReq.user.uid,
        volunteerName,
        volunteerSkills,
        status: (req.body as any).status || 'pending',
        date: (req.body as any).date || new Date().toISOString().split('T')[0],
      };

      const volunteerRequest = await this.requestService.createRequest(merged);
      this.handleSuccess(res, volunteerRequest);
    } catch (error: any) {
      this.handleError(error, res, 'RequestController');
    }
  }

  async getAllRequests(req: Request, res: Response) {
    try {
      const requests = await this.requestService.getAllRequests();
      this.handleSuccess(res, requests);
    } catch (error: any) {
      this.handleError(error, res, 'RequestController');
    }
  }

  async getRequestById(req: Request, res: Response) {
    try {
      const volunteerRequest = await this.requestService.getRequestById(req.params.id as string);
      if (!volunteerRequest) return this.handleError(new Error('NOT_FOUND'), res, 'RequestController');
      this.handleSuccess(res, volunteerRequest);
    } catch (error: any) {
      this.handleError(error, res, 'RequestController');
    }
  }

  async updateRequest(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user?.uid) throw new Error('Unauthorized');
      const volunteerRequest = await this.requestService.updateRequest(
        req.params.id as string,
        req.body,
        authReq.user.uid
      );
      this.handleSuccess(res, volunteerRequest);
    } catch (error: any) {
      this.handleError(error, res, 'RequestController');
    }
  }

  async deleteRequest(req: Request, res: Response) {
    try {
      await this.requestService.deleteRequest(req.params.id as string);
      this.handleSuccess(res, { message: 'Request deleted successfully' });
    } catch (error: any) {
      this.handleError(error, res, 'RequestController');
    }
  }
}
