import { ActivityRepository } from '../repositories/ActivityRepository';

export class ActivityService {
  private activityRepository = new ActivityRepository();

  async createActivity(activityData: any) {
    return await this.activityRepository.createActivity(activityData);
  }

  async getAllActivities() {
    return await this.activityRepository.getAllActivities();
  }

  async getActivitiesByVolunteer(volunteerId: string) {
    return await this.activityRepository.getActivitiesByVolunteer(volunteerId);
  }

  async getActivitiesByNgo(ngoId: string) {
    return await this.activityRepository.getActivitiesByNgo(ngoId);
  }
}
