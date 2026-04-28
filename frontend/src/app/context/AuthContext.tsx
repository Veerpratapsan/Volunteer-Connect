import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

/** Firestore `users/{uid}` shape (written by the API; you can edit values in Firebase for manual updates). */
export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: 'ngo' | 'volunteer';
  skills?: string[];
  description?: string;
  uniqueId?: string;
  totalHours?: number;
  tasksCompleted?: number;
  activeAssignments?: number;
  activeNeeds?: number;
  volunteersAssigned?: number;
  urgentRequests?: number;
  issuesResolved?: number;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  userRole: 'ngo' | 'volunteer' | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  profile: null,
  loading: true,
  logout: async () => {},
  getToken: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'ngo' | 'volunteer' | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let profileUnsub: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      profileUnsub?.();
      profileUnsub = undefined;

      setUser(firebaseUser);

      if (!firebaseUser) {
        setUserRole(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const userRef = doc(db, 'users', firebaseUser.uid);
      profileUnsub = onSnapshot(
        userRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setUserRole((data.role as 'ngo' | 'volunteer') || null);
            setProfile({ id: snap.id, ...data } as UserProfile);
          } else {
            setUserRole(null);
            setProfile(null);
          }
          setLoading(false);
        },
        (error) => {
          console.error('Error subscribing to user profile:', error);
          setUserRole(null);
          setProfile(null);
          setLoading(false);
        }
      );
    });

    return () => {
      profileUnsub?.();
      unsubscribeAuth();
    };
  }, []);

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  const getToken = async () => {
    if (!user) return null;
    return await user.getIdToken();
  };

  return (
    <AuthContext.Provider value={{ user, userRole, profile, loading, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};
