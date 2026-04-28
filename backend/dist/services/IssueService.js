"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueService = void 0;
const IssueRepository_1 = require("../repositories/IssueRepository");
class IssueService {
    issueRepository = new IssueRepository_1.IssueRepository();
    async createIssue(issueData) {
        return await this.issueRepository.createIssue(issueData);
    }
    async getAllIssues() {
        return await this.issueRepository.getAllIssues();
    }
    async getIssueById(issueId) {
        return await this.issueRepository.getIssueById(issueId);
    }
    async updateIssue(issueId, updateData) {
        return await this.issueRepository.updateIssue(issueId, updateData);
    }
    async deleteIssue(issueId) {
        return await this.issueRepository.deleteIssue(issueId);
    }
}
exports.IssueService = IssueService;
