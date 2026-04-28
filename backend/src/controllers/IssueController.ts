import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { IssueService } from '../services/IssueService';
import { UserRepository } from '../repositories/UserRepository';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class IssueController extends BaseController {
  private issueService = new IssueService();
  private userRepository = new UserRepository();

  async createIssue(req: Request, res: Response) {
    try {
      const authReq = req as AuthenticatedRequest;
      if (!authReq.user?.uid) throw new Error('Unauthorized');

      const volunteer = await this.userRepository.getUserById(authReq.user.uid);
      const volunteerName =
        (typeof (volunteer as any)?.name === 'string' && (volunteer as any).name) ||
        authReq.user.email?.split('@')[0] ||
        'Volunteer';

      const merged = {
        ...req.body,
        volunteerId: authReq.user.uid,
        volunteerName,
      };

      const issue = await this.issueService.createIssue(merged);
      this.handleSuccess(res, issue);
    } catch (error: any) {
      this.handleError(error, res, 'IssueController');
    }
  }

  async getAllIssues(req: Request, res: Response) {
    try {
      const issues = await this.issueService.getAllIssues();
      this.handleSuccess(res, issues);
    } catch (error: any) {
      this.handleError(error, res, 'IssueController');
    }
  }

  async getIssueById(req: Request, res: Response) {
    try {
      const issue = await this.issueService.getIssueById(req.params.id as string);
      if (!issue) return this.handleError(new Error('NOT_FOUND'), res, 'IssueController');
      this.handleSuccess(res, issue);
    } catch (error: any) {
      this.handleError(error, res, 'IssueController');
    }
  }

  async updateIssue(req: Request, res: Response) {
    try {
      const issue = await this.issueService.updateIssue(req.params.id as string, req.body);
      this.handleSuccess(res, issue);
    } catch (error: any) {
      this.handleError(error, res, 'IssueController');
    }
  }

  async deleteIssue(req: Request, res: Response) {
    try {
      await this.issueService.deleteIssue(req.params.id as string);
      this.handleSuccess(res, { message: 'Issue deleted successfully' });
    } catch (error: any) {
      this.handleError(error, res, 'IssueController');
    }
  }
}
