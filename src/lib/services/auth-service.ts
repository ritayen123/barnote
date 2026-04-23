import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { userService } from "./user-service";

export const authService = {
  async signInWithGoogle(): Promise<{ firebaseUser: FirebaseUser; isNew: boolean }> {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    // Check if local user exists for this Firebase UID
    const existingUser = await userService.getByFirebaseUid(firebaseUser.uid);

    if (!existingUser) {
      // Create local user linked to Firebase
      const displayName = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User";
      await userService.register(displayName, firebaseUser.uid);
      return { firebaseUser, isNew: true };
    } else {
      // Login existing user
      await userService.loginByFirebaseUid(firebaseUser.uid);
      return { firebaseUser, isNew: false };
    }
  },

  async signOutUser(): Promise<void> {
    await signOut(auth);
    userService.logout();
  },

  onAuthChange(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  },

  getCurrentFirebaseUser(): FirebaseUser | null {
    return auth.currentUser;
  },
};
