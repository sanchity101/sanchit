// Firebase SDK Initialization & Helpers (Modular Web SDK v10)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  push,
  update,
  remove,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWmd7BFG-z_bHKQQok9npE9L6BtloowTk",
  authDomain: "cloud-vault-37f68.firebaseapp.com",
  databaseURL: "https://cloud-vault-37f68-default-rtdb.firebaseio.com",
  projectId: "cloud-vault-37f68",
  storageBucket: "cloud-vault-37f68.firebasestorage.app",
  messagingSenderId: "1035087710500",
  appId: "1:1035087710500:web:f0cc89e83f61b40c7dcbb1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);
const googleProvider = new GoogleAuthProvider();

/**
 * Ensures user document exists in Firestore /users/{uid}
 */
async function syncUserProfile(user, additionalData = {}) {
  if (!user) return null;
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    const profile = {
      email: user.email,
      displayName: additionalData.displayName || user.displayName || "User",
      createdAt: serverTimestamp(),
      plan: "free",
      storageUsed: 0
    };
    await setDoc(userRef, profile);
    return profile;
  }
  return snap.data();
}

/**
 * Ensures user document exists in Realtime Database /users/{uid}
 */
async function syncUserToRealtimeDB(user, additionalData = {}) {
  if (!user) return null;
  const userRef = ref(rtdb, `users/${user.uid}`);
  const snap = await get(userRef);

  if (!snap.exists()) {
    const profile = {
      email: user.email,
      displayName: additionalData.displayName || user.displayName || "User",
      createdAt: Date.now(),
      plan: "free",
      storageUsed: 0
    };
    await set(userRef, profile);
    return profile;
  }
  return snap.val();
}

export {
  app,
  auth,
  db,
  rtdb,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  // Firestore
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp,
  syncUserProfile,
  // Realtime Database
  ref,
  set,
  get,
  child,
  push,
  update,
  remove,
  onValue,
  syncUserToRealtimeDB
};
