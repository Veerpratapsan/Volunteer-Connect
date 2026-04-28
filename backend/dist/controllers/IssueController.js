"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueController = void 0;
const BaseController_1 = require("./BaseController");
const IssueService_1 = require("../services/IssueService");
const UserRepository_1 = require("../repositories/UserRepository");
class IssueController extends BaseController_1.BaseController {
    issueService = new IssueService_1.IssueService();
    userRepository = new UserRepository_1.UserRepository();
    async createIssue(req, res) {
        try {
            const authReq = req;
            if (!authReq.user?.uid)
                throw new Error('Unauthorized');
            const volunteer = await this.userRepository.getUserById(authReq.user.uid);
            const volunteerName = (typeof volunteer?.name === 'string' && volunteer.name) ||
                authReq.user.email?.split('@')[0] ||
                'Volunteer';
            const merged = {
                ...req.body,
                volunteerId: authReq.user.uid,
                volunteerName,
            };
            const issue = await this.issueService.createIssue(merged);
            this.handleSuccess(res, issue);
        }
        catch (error) {
            this.handleError(error, res, 'IssueController');
        }
    }
    async getAllIssues(req, res) {
        try {
            const issues = await this.issueService.getAllIssues();
            this.handleSuccess(res, issues);
        }
        catch (error) {
            this.handleError(error, res, 'IssueController');
        }
    }
    async getIssueById(req, res) {
        try {
            const issue = await this.issueService.getIssueById(req.params.id);
            if (!issue)
                return this.handleError(new Error('NOT_FOUND'), res, 'IssueController');
            this.handleSuccess(res, issue);
        }
        catch (error) {
            this.handleError(error, res, 'IssueController');
        }
    }
    async updateIssue(req, res) {
        try {
            const issue = await this.issueService.updateIssue(req.params.id, req.body);
            this.handleSuccess(res, issue);
        }
        catch (error) {
            this.handleError(error, res, 'IssueController');
        }
    }
    async deleteIssue(req, res) {
        try {
            await this.issueService.deleteIssue(req.params.id);
            this.handleSuccess(res, { message: 'Issue deleted successfully' });
        }
        catch (error) {
            this.handleError(error, res, 'IssueController');
        }
    }
}
exports.IssueController = IssueController;
