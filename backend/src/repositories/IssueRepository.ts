import { db } from '../config/unifiedConfig';

export class IssueRepository {
  private collection = db.collection('issues');

  async createIssue(issueData: any) {
    const docRef = this.collection.doc();
    const merged = { id: docRef.id, ...issueData };
    // Firestore rejects `undefined` field values; JSON round-trip drops them safely for plain JSON payloads.
    const cleaned = JSON.parse(JSON.stringify(merged)) as Record<string, unknown>;
    await docRef.set(cleaned);
    return cleaned;
  }

  async getAllIssues() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => doc.data());
  }

  async getIssueById(issueId: string) {
    const doc = await this.collection.doc(issueId).get();
    if (!doc.exists) return null;
    return doc.data();
  }

  async updateIssue(issueId: string, updateData: any) {
    await this.collection.doc(issueId).update(updateData);
    return await this.getIssueById(issueId);
  }

  async deleteIssue(issueId: string) {
    await this.collection.doc(issueId).delete();
  }
}
