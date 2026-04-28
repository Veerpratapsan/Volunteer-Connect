import { db } from '../config/unifiedConfig';

export class RequestRepository {
  private collection = db.collection('requests');

  async createRequest(requestData: any) {
    const docRef = this.collection.doc();
    await docRef.set({ id: docRef.id, ...requestData });
    return { id: docRef.id, ...requestData };
  }

  async getAllRequests() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => doc.data());
  }

  async getRequestById(requestId: string) {
    const doc = await this.collection.doc(requestId).get();
    if (!doc.exists) return null;
    return doc.data();
  }

  async updateRequest(requestId: string, updateData: any) {
    await this.collection.doc(requestId).update(updateData);
    return await this.getRequestById(requestId);
  }

  async deleteRequest(requestId: string) {
    await this.collection.doc(requestId).delete();
  }
}
