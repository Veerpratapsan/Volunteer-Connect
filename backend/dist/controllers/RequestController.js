"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestController = void 0;
const BaseController_1 = require("./BaseController");
const RequestService_1 = require("../services/RequestService");
const UserRepository_1 = require("../repositories/UserRepository");
class RequestController extends BaseController_1.BaseController {
    requestService = new RequestService_1.RequestService();
    userRepository = new UserRepository_1.UserRepository();
    async createRequest(req, res) {
        try {
            const authReq = req;
            if (!authReq.user?.uid)
                throw new Error('Unauthorized');
            const volunteer = await this.userRepository.getUserById(authReq.user.uid);
            const volunteerSkills = Array.isArray(volunteer?.skills) ? volunteer.skills : [];
            const volunteerName = (typeof volunteer?.name === 'string' && volunteer.name) ||
                authReq.user.email?.split('@')[0] ||
                'Volunteer';
            const merged = {
                ...req.body,
                volunteerId: authReq.user.uid,
                volunteerName,
                volunteerSkills,
                status: req.body.status || 'pending',
                date: req.body.date || new Date().toISOString().split('T')[0],
            };
            const volunteerRequest = await this.requestService.createRequest(merged);
            this.handleSuccess(res, volunteerRequest);
        }
        catch (error) {
            this.handleError(error, res, 'RequestController');
        }
    }
    async getAllRequests(req, res) {
        try {
            const requests = await this.requestService.getAllRequests();
            this.handleSuccess(res, requests);
        }
        catch (error) {
            this.handleError(error, res, 'RequestController');
        }
    }
    async getRequestById(req, res) {
        try {
            const volunteerRequest = await this.requestService.getRequestById(req.params.id);
            if (!volunteerRequest)
                return this.handleError(new Error('NOT_FOUND'), res, 'RequestController');
            this.handleSuccess(res, volunteerRequest);
        }
        catch (error) {
            this.handleError(error, res, 'RequestController');
        }
    }
    async updateRequest(req, res) {
        try {
            const authReq = req;
            if (!authReq.user?.uid)
                throw new Error('Unauthorized');
            const volunteerRequest = await this.requestService.updateRequest(req.params.id, req.body, authReq.user.uid);
            this.handleSuccess(res, volunteerRequest);
        }
        catch (error) {
            this.handleError(error, res, 'RequestController');
        }
    }
    async deleteRequest(req, res) {
        try {
            await this.requestService.deleteRequest(req.params.id);
            this.handleSuccess(res, { message: 'Request deleted successfully' });
        }
        catch (error) {
            this.handleError(error, res, 'RequestController');
        }
    }
}
exports.RequestController = RequestController;
