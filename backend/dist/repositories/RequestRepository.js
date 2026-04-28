"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRepository = void 0;
const unifiedConfig_1 = require("../config/unifiedConfig");
class RequestRepository {
    collection = unifiedConfig_1.db.collection('requests');
    async createRequest(requestData) {
        const docRef = this.collection.doc();
        await docRef.set({ id: docRef.id, ...requestData });
        return { id: docRef.id, ...requestData };
    }
    async getAllRequests() {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => doc.data());
    }
    async getRequestById(requestId) {
        const doc = await this.collection.doc(requestId).get();
        if (!doc.exists)
            return null;
        return doc.data();
    }
    async updateRequest(requestId, updateData) {
        await this.collection.doc(requestId).update(updateData);
        return await this.getRequestById(requestId);
    }
    async deleteRequest(requestId) {
        await this.collection.doc(requestId).delete();
    }
}
exports.RequestRepository = RequestRepository;
