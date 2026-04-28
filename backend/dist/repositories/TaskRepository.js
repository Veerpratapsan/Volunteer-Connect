"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const unifiedConfig_1 = require("../config/unifiedConfig");
class TaskRepository {
    collection = unifiedConfig_1.db.collection('tasks');
    async createTask(taskData) {
        const docRef = this.collection.doc();
        await docRef.set({ id: docRef.id, ...taskData });
        return { id: docRef.id, ...taskData };
    }
    async getAllTasks() {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => doc.data());
    }
    async getTaskById(taskId) {
        const doc = await this.collection.doc(taskId).get();
        if (!doc.exists)
            return null;
        return doc.data();
    }
    async updateTask(taskId, updateData) {
        await this.collection.doc(taskId).update(updateData);
        return await this.getTaskById(taskId);
    }
}
exports.TaskRepository = TaskRepository;
