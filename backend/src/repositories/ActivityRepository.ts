import { db } from '../config/unifiedConfig';

export class ActivityRepository {
  private collection = db.collection('activities');

  async createActivity(activityData: any) {
    const docRef = this.collection.doc();
    await docRef.set({ id: docRef.id, ...activityData });
    return { id: docRef.id, ...activityData };
  }

  async getAllActivities() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => doc.data());
  }

  async getActivitiesByVolunteer(volunteerId: string) {
    const snapshot = await this.collection.where('volunteerId', '==', volunteerId).get();
    return snapshot.docs.map(doc => doc.data());
  }

  async getActivitiesByNgo(ngoId: string) {
    const snapshot = await this.collection.where('ngoId', '==', ngoId).get();
    return snapshot.docs.map(doc => doc.data());
  }
}
