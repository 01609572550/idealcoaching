import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/config.js';
import { collections, roles } from '../data/constants.js';
import { getById, upsertDoc } from '../services/firestoreService.js';
import { logActivity } from '../services/activityService.js';
import { usernameToEmail, can } from '../utils/security.js';

const AuthContext = createContext(null);
const INACTIVITY_MS = 30 * 60 * 1000;

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, async user => {
    setFirebaseUser(user);
    if (user) {
      const savedProfile = await getById(collections.users, user.uid);
      setProfile(savedProfile || {
        id: user.uid,
        uid: user.uid,
        name: user.displayName || user.email,
        email: user.email,
        role: roles.SUPER_ADMIN,
        status: 'Active'
      });
    } else {
      setProfile(null);
    }
    setLoading(false);
  }), []);

  useEffect(() => {
    if (!firebaseUser) return undefined;
    let timer;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => signOut(auth), INACTIVITY_MS);
    };
    ['click', 'keydown', 'mousemove', 'touchstart'].forEach(event => window.addEventListener(event, reset));
    reset();
    return () => {
      clearTimeout(timer);
      ['click', 'keydown', 'mousemove', 'touchstart'].forEach(event => window.removeEventListener(event, reset));
    };
  }, [firebaseUser]);

  const value = useMemo(() => ({
    user: firebaseUser,
    profile,
    role: profile?.role,
    loading,
    can: permission => can(profile?.role, permission),
    async login(username, password) {
      const email = usernameToEmail(username);
      const result = await signInWithEmailAndPassword(auth, email, password);
      await logActivity(result.user, 'login', { email });
      return result;
    },
    async logout() {
      await logActivity(firebaseUser, 'logout');
      return signOut(auth);
    },
    async changePassword(currentPassword, nextPassword) {
      const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
      await reauthenticateWithCredential(firebaseUser, credential);
      await updatePassword(firebaseUser, nextPassword);
      await logActivity(firebaseUser, 'password_changed');
    },
    async createStaff({ username, password, name, role }) {
      const email = usernameToEmail(username);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      const staff = {
        uid: result.user.uid,
        name,
        email,
        username,
        role,
        status: 'Active',
        createdAt: new Date().toISOString()
      };
      await upsertDoc(collections.users, result.user.uid, staff);
      await logActivity(firebaseUser, 'staff_created', { email, role });
      return staff;
    },
    async saveStaff(uid, data) {
      await upsertDoc(collections.users, uid, { ...data, updatedAt: new Date().toISOString() });
      await logActivity(firebaseUser, 'staff_updated', { uid });
    },
    async deleteCurrentFirebaseUser() {
      if (auth.currentUser) await deleteUser(auth.currentUser);
    }
  }), [firebaseUser, loading, profile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
