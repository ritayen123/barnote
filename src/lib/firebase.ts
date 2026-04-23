import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDZllQzOucKVrDET4FtB94zZlAtIyaVH0Y",
  authDomain: "barnote-1b8a3.firebaseapp.com",
  projectId: "barnote-1b8a3",
  storageBucket: "barnote-1b8a3.firebasestorage.app",
  messagingSenderId: "315565889150",
  appId: "1:315565889150:web:8c35dd380aa28c938baa2f",
  measurementId: "G-W1046RHYYN",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
