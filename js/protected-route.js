import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Check if the user is authenticated. If not, redirect to login page.
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // User is signed out, redirect to login
    window.location.href = "login.html";
  }
});
