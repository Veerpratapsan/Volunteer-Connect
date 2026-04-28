"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityRepository = void 0;
const unifiedConfig_1 = require("../config/unifiedConfig");
class ActivityRepository {
    collection = unifiedConfig_1.db.collection('activities');
    async createActivity(activityData) {
        const docRef = this.collection.doc();
        await docRef.set({ id: docRef.id, ...activityData });
        return { id: docRef.id, ...activityData };
    }
    async getAllActivities() {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => doc.data());
    }
    async getActivitiesByVolunteer(volunteerId) {
        const snapshot = await this.collection.where('volunteerId', '==', volunteerId).get();
        return snapshot.docs.map(doc => doc.data());
    }
    async getActivitiesByNgo(ngoId) {
        const snapshot = await this.collection.where('ngoId', '==', ngoId).get();
        return snapshot.docs.map(doc => doc.data());
    }
}
exports.ActivityRepository = ActivityRepository;
