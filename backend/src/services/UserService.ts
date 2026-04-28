// backend/src/services/UserService.ts
import { UserRepository } from '../repositories/UserRepository';
import { auth as adminAuth } from '../config/unifiedConfig';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUserProfile(uid: string, email: string, role: 'ngo' | 'volunteer', extraData: any) {
    const existingUser = await this.userRepository.getUserById(uid);
    if (existingUser) {
      throw new Error('User profile already exists');
    }
    
    const profileData = {
      email,
      role,
      createdAt: new Date().toISOString(),
      ...extraData,
      // Default initial metrics based on role
      ...(role === 'volunteer' ? { totalHours: 0, tasksCompleted: 0, activeAssignments: 0 } : { activeNeeds: 0, volunteersAssigned: 0, urgentRequests: 0, issuesResolved: 0 })
    };

    const created = await this.userRepository.createUser(uid, profileData);

    if (typeof extraData?.name === 'string' && extraData.name.trim().length > 0) {
      try {
        await adminAuth.updateUser(uid, { displayName: extraData.name.trim() });
      } catch (e) {
        console.warn('[UserService] Could not sync displayName to Firebase Auth:', e);
      }
    }

    return created;
  }

  async getProfile(uid: string) {
    const user = await this.userRepository.getUserById(uid);
    if (!user) throw new Error('NOT_FOUND: User not found');
    return user;
  }
}
