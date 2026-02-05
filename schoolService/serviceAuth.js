// Imports
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {
    doc,
    getDoc,
    getFirestore,
    serverTimestamp,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Firebase config
export const firebaseConfig = {
    apiKey: "AIzaSyDKBBs0TWerQno_u8yjNqV5qmvQImf6xA0",
    authDomain: "club-hub-2.firebaseapp.com",
    projectId: "club-hub-2",
    storageBucket: "club-hub-2.firebasestorage.app",
    messagingSenderId: "339870020143",
    appId: "1:339870020143:web:cc698c287ed642e3798cda",
    measurementId: "G-P97ML6ZP15"
};

// setting vars
const app = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

//Cookie helpers from https://www.w3schools.com/js/js_cookies.asp
function generateSecureRandomString(lengthInBytes) {
    const byteArray = new Uint8Array(lengthInBytes);
    window.crypto.getRandomValues(byteArray);
    return Array.from(byteArray, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
export function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${cname}=${cvalue};${expires};path=/;SameSite=Strict`;
}
export function delete_cookie(name) {
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
export function getCookie(cname) {
    const nameEQ = cname + "=";
    const ca = document.cookie.split(";");
    for (let c of ca) {
        c = c.trim();
        if (c.startsWith(nameEQ)) return decodeURIComponent(c.substring(nameEQ.length));
    }
    return "";
}

// was having problems with rendering the users name on club page due to improper async handeling
export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            unsubscribe();
            resolve(user);
        }, reject);
    });
};


// Create a new user (Firebase Auth + Firestore profile)
export async function createUser(email, password, firstName, lastName, gradYr) {
    try {
        const isAdmin = false;

        // Create the auth record
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        await signInWithEmailAndPassword(auth, email, password);

        // Store a profile document – not password because bad
        await setDoc(doc(db, "students", uid), {
            uid,
            email,
            firstName,
            lastName,
            gradYr,
            admin: isAdmin,
            createdAt: serverTimestamp(),
        });
        window.location.href = "./serviceStudentPage.html";

        return true;
    } catch (err) {
        alert("Account creation failed: " + err.message);
        console.error("createUser error:", err);
        return false;
    }
}

// check if the user had admin perms
export async function checkAdminStatus() {
    const user = await getCurrentUser();
    if (!user) return false;
    const docRef = doc(db, "students", user.uid);
    const docSnap = await getDoc(docRef);
    const userData = docSnap.data();
    if (docSnap.exists()) {
        return userData.admin === true;
    }
    return false;
}

export async function loginUser(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        if (await checkAdminStatus()) {
            window.location.href = "./serviceAdminPanel.html";
            return { success: true };
        } else {
            window.location.href = "./serviceStudentPage.html";
            return { success: true };
        }


    } catch (err) {
        alert("Login failed: " + err.message);
        console.warn("loginUser error:", err);
        return { success: false, error: err };
    }
}

// Log out
export async function logoutUser() {
    try {
        await signOut(auth);
        window.location.href = "./serviceHome.html";
    } catch (err) {
        alert("Logout failed: " + err.message);
        console.error("logout error:", err);
    }
}


// Check if a user is already signed in
export async function checkLoginStatus() {
    const isAdmin = await checkAdminStatus();
    if (isAdmin) {
        window.location.href = "./serviceAdminPanel.html";
        return true; // User is an admin and redirected, consider them logged in
    }

    const user = await getCurrentUser();
    return !!user; // make sure returning boolean
}

// Get the current user's first name
export async function getFirstName() {
    const user = await getCurrentUser();
    if (!user) return null;

    const docRef = doc(db, "students", user.uid);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? docSnap.data().firstName : null;
}

// Get the current user's last name
export async function getLastName() {
    const user = await getCurrentUser();
    if (!user) return null;

    const docRef = doc(db, "students", user.uid);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? docSnap.data().lastName : null;
}

// Get the current user's email
export async function getEmail() {
    const user = await getCurrentUser();
    return user ? user.email : null;
}

export async function getTotalHours(){
    const user = await getCurrentUser()
    const uid = user.uid;
    console.log(uid);
    const docRef = doc(db, "students", uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    if (docSnap.exists()) {
        return data.totalNonSchoolHours || 0;
    }
    return null;
}

export async function getTotalSchoolServiceHours(){
    const user = await getCurrentUser()
    const uid = user.uid;
    console.log(uid);
    const docRef = doc(db, "students", uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    if (docSnap.exists()) {
        return data.totalSchoolHours || 0;
    }
    return null;
}

export async function getGradYr(){
    const user = await getCurrentUser()
    const uid = user.uid;
    console.log(uid);
    const docRef = doc(db, "students", uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    if (docSnap.exists()) {
        return data.gradYr || "0";
    }
    return null;
}

export async function calculateSchoolServiceHoursPercentage() {
    const user = await getCurrentUser();
    if (!user) return 0;

    const docRef = doc(db, "students", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const totalSchoolHours = docSnap.data().totalSchoolHours || 0;
        const gradYear = docSnap.data().gradYr || 2030;
        if (gradYear === 2027) {
            const preliminaryResult = (totalSchoolHours / 10) * 100
            return Math.min(preliminaryResult, 100).toFixed(0);
        } else if (gradYear === 2028) {
            const preliminaryResult = (totalSchoolHours / 20) * 100
            return Math.min(preliminaryResult, 100).toFixed(0);
        } else if (gradYear >= 2029) {
            const preliminaryResult = (totalSchoolHours / 30) * 100
            return Math.min(preliminaryResult, 100).toFixed(0);
        } else {
            return "ERROR";
        }

    }
    return 0;
}

export async function calculateNonSchoolServiceHoursPercentage() {
    const user = await getCurrentUser();
    if (!user) return 0;

    const docRef = doc(db, "students", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const totalNonSchoolHours = docSnap.data().totalNonSchoolHours || 0;
        console.log(totalNonSchoolHours);
        const gradYear = docSnap.data().gradYr || 2030;
        if (gradYear === 2027) {
            const preliminaryResult = (totalNonSchoolHours / 30) * 100
            return Math.min(preliminaryResult, 100).toFixed(0);
        } else if (gradYear === 2028) {
            const preliminaryResult = (totalNonSchoolHours / 15) * 100
            return Math.min(preliminaryResult, 100).toFixed(0);
        } else if (gradYear >= 2029) {
            // const preliminaryResult = (totalNonSchoolHours / 0) * 100
            // return Math.min(preliminaryResult, 100);
            return "N/A";
        } else {
            return "ERROR";
        }

    }
    return 0;
}
