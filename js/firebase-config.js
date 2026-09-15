// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

// TODO: Replace this with your app's Firebase project configuration
// Go to Firebase Console -> Project Settings -> General -> Your apps -> Firebase SDK snippet
const firebaseConfig = {
  apiKey: "AIzaSyA9jmgkSHzCTKN_qo7v1ft0-KVxyNShw5c",
  authDomain: "cloud-storage-b03a4.firebaseapp.com",
  projectId: "cloud-storage-b03a4",
  storageBucket: "cloud-storage-b03a4.firebasestorage.app",
  messagingSenderId: "1025291795862",
  appId: "1:1025291795862:web:e6895690c3393ee2dbb1b7",
  measurementId: "G-VY3XR6XVVM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
