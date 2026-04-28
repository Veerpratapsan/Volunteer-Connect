import { db } from '../config/unifiedConfig';

export class TaskRepository {
  private collection = db.collection('tasks');

  async createTask(taskData: any) {
    const docRef = this.collection.doc();
    await docRef.set({ id: docRef.id, ...taskData });
    return { id: docRef.id, ...taskData };
  }

  async getAllTasks() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => doc.data());
  }

  async getTaskById(taskId: string) {
    const doc = await this.collection.doc(taskId).get();
    if (!doc.exists) return null;
    return doc.data();
  }

  async updateTask(taskId: string, updateData: any) {
    await this.collection.doc(taskId).update(updateData);
    return await this.getTaskById(taskId);
  }
}
