"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityController = void 0;
const BaseController_1 = require("./BaseController");
const ActivityService_1 = require("../services/ActivityService");
class ActivityController extends BaseController_1.BaseController {
    activityService = new ActivityService_1.ActivityService();
    async createActivity(req, res) {
        try {
            const activity = await this.activityService.createActivity(req.body);
            this.handleSuccess(res, activity);
        }
        catch (error) {
            this.handleError(error, res, 'ActivityController');
        }
    }
    async getAllActivities(req, res) {
        try {
            const activities = await this.activityService.getAllActivities();
            this.handleSuccess(res, activities);
        }
        catch (error) {
            this.handleError(error, res, 'ActivityController');
        }
    }
    async getActivitiesByVolunteer(req, res) {
        try {
            const activities = await this.activityService.getActivitiesByVolunteer(req.params.volunteerId);
            this.handleSuccess(res, activities);
        }
        catch (error) {
            this.handleError(error, res, 'ActivityController');
        }
    }
    async getActivitiesByNgo(req, res) {
        try {
            const activities = await this.activityService.getActivitiesByNgo(req.params.ngoId);
            this.handleSuccess(res, activities);
        }
        catch (error) {
            this.handleError(error, res, 'ActivityController');
        }
    }
}
exports.ActivityController = ActivityController;
