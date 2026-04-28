// backend/src/repositories/UserRepository.ts
import { db } from '../config/unifiedConfig';

export class UserRepository {
  private collection = db.collection('users');

  async createUser(uid: string, data: any) {
    await this.collection.doc(uid).set(data);
    return { id: uid, ...data };
  }

  async getUserById(uid: string) {
    const doc = await this.collection.doc(uid).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  async updateUser(uid: string, data: any) {
    await this.collection.doc(uid).update(data);
  }
}
