import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { ActivityService } from '../services/ActivityService';

export class ActivityController extends BaseController {
  private activityService = new ActivityService();

  async createActivity(req: Request, res: Response) {
    try {
      const activity = await this.activityService.createActivity(req.body);
      this.handleSuccess(res, activity);
    } catch (error: any) {
      this.handleError(error, res, 'ActivityController');
    }
  }

  async getAllActivities(req: Request, res: Response) {
    try {
      const activities = await this.activityService.getAllActivities();
      this.handleSuccess(res, activities);
    } catch (error: any) {
      this.handleError(error, res, 'ActivityController');
    }
  }

  async getActivitiesByVolunteer(req: Request, res: Response) {
    try {
      const activities = await this.activityService.getActivitiesByVolunteer(req.params.volunteerId as string);
      this.handleSuccess(res, activities);
    } catch (error: any) {
      this.handleError(error, res, 'ActivityController');
    }
  }

  async getActivitiesByNgo(req: Request, res: Response) {
    try {
      const activities = await this.activityService.getActivitiesByNgo(req.params.ngoId as string);
      this.handleSuccess(res, activities);
    } catch (error: any) {
      this.handleError(error, res, 'ActivityController');
    }
  }
}
