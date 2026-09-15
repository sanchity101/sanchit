import { auth, db } from "./firebase-config.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// --- Google Auth Setup ---
const googleProvider = new GoogleAuthProvider();

async function handleGoogleSignIn() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Ensure user details exist in Firestore (merge to not overwrite if they already exist)
        await setDoc(doc(db, "Users", user.uid), {
            userId: user.uid,
            name: user.displayName,
            email: user.email
        }, { merge: true });

        // Redirect to Dashboard
        window.location.href = "dashboard.html";
    } catch (error) {
        console.error("Error with Google Sign-In:", error);
        alert("Failed to sign in with Google: " + error.message);
    }
}

// Bind Google buttons if they exist on the page
const googleBtns = document.querySelectorAll('#google-login-btn');
googleBtns.forEach(btn => {
    btn.addEventListener('click', handleGoogleSignIn);
});

// --- Normal Email/Password Registration ---
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword');
        const errorMsg = document.getElementById('error-message');

        if (confirmPassword && password !== confirmPassword.value) {
            if(errorMsg) {
                errorMsg.classList.remove('hidden');
                errorMsg.querySelector('p').textContent = "Passwords do not match.";
            }
            return;
        }

        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user details in Firestore
            await setDoc(doc(db, "Users", user.uid), {
                userId: user.uid,
                name: name,
                email: email
            });

            // Redirect to Dashboard
            window.location.href = "dashboard.html";
        } catch (error) {
            console.error("Error signing up:", error);
            if(errorMsg) {
                errorMsg.classList.remove('hidden');
                errorMsg.querySelector('p').textContent = error.message;
            }
        }
    });
}

// --- Normal Email/Password Login ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('error-message');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect to Dashboard
            window.location.href = "dashboard.html";
        } catch (error) {
            console.error("Error logging in:", error);
            if(errorMsg) {
                errorMsg.classList.remove('hidden');
                errorMsg.querySelector('p').textContent = "Incorrect email or password. Please try again.";
            }
        }
    });
}

// --- Handle Logout ---
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            window.location.href = "login.html";
        } catch (error) {
            console.error("Error signing out:", error);
        }
    });
}
