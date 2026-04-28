import { IssueRepository } from '../repositories/IssueRepository';

export class IssueService {
  private issueRepository = new IssueRepository();

  async createIssue(issueData: any) {
    return await this.issueRepository.createIssue(issueData);
  }

  async getAllIssues() {
    return await this.issueRepository.getAllIssues();
  }

  async getIssueById(issueId: string) {
    return await this.issueRepository.getIssueById(issueId);
  }

  async updateIssue(issueId: string, updateData: any) {
    return await this.issueRepository.updateIssue(issueId, updateData);
  }

  async deleteIssue(issueId: string) {
    return await this.issueRepository.deleteIssue(issueId);
  }
}
