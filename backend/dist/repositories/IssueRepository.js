"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueRepository = void 0;
const unifiedConfig_1 = require("../config/unifiedConfig");
class IssueRepository {
    collection = unifiedConfig_1.db.collection('issues');
    async createIssue(issueData) {
        const docRef = this.collection.doc();
        const merged = { id: docRef.id, ...issueData };
        // Firestore rejects `undefined` field values; JSON round-trip drops them safely for plain JSON payloads.
        const cleaned = JSON.parse(JSON.stringify(merged));
        await docRef.set(cleaned);
        return cleaned;
    }
    async getAllIssues() {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => doc.data());
    }
    async getIssueById(issueId) {
        const doc = await this.collection.doc(issueId).get();
        if (!doc.exists)
            return null;
        return doc.data();
    }
    async updateIssue(issueId, updateData) {
        await this.collection.doc(issueId).update(updateData);
        return await this.getIssueById(issueId);
    }
    async deleteIssue(issueId) {
        await this.collection.doc(issueId).delete();
    }
}
exports.IssueRepository = IssueRepository;
