"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
// backend/src/repositories/UserRepository.ts
const unifiedConfig_1 = require("../config/unifiedConfig");
class UserRepository {
    collection = unifiedConfig_1.db.collection('users');
    async createUser(uid, data) {
        await this.collection.doc(uid).set(data);
        return { id: uid, ...data };
    }
    async getUserById(uid) {
        const doc = await this.collection.doc(uid).get();
        if (!doc.exists)
            return null;
        return { id: doc.id, ...doc.data() };
    }
    async updateUser(uid, data) {
        await this.collection.doc(uid).update(data);
    }
}
exports.UserRepository = UserRepository;
