"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const ActivityRepository_1 = require("../repositories/ActivityRepository");
class ActivityService {
    activityRepository = new ActivityRepository_1.ActivityRepository();
    async createActivity(activityData) {
        return await this.activityRepository.createActivity(activityData);
    }
    async getAllActivities() {
        return await this.activityRepository.getAllActivities();
    }
    async getActivitiesByVolunteer(volunteerId) {
        return await this.activityRepository.getActivitiesByVolunteer(volunteerId);
    }
    async getActivitiesByNgo(ngoId) {
        return await this.activityRepository.getActivitiesByNgo(ngoId);
    }
}
exports.ActivityService = ActivityService;
