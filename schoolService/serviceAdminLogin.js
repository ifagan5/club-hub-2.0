import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, collectionGroup, addDoc, getDocs,getDoc, doc, updateDoc, deleteDoc, setDoc, Timestamp, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {loginUser, checkLoginStatus} from "./serviceAuth.js";


//haha
const firebaseConfig = {
    apiKey: "AIzaSyDKBBs0TWerQno_u8yjNqV5qmvQImf6xA0",
    authDomain: "club-hub-2.firebaseapp.com",
    projectId: "club-hub-2",
    storageBucket: "club-hub-2.firebasestorage.app",
    messagingSenderId: "339870020143",
    appId: "1:339870020143:web:cc698c287ed642e3798cda",
    measurementId: "G-P97ML6ZP15"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


// const loggedInUser = sessionStorage.getItem("loggedInStudent");
// if (loggedInUser) {
//     location.replace("serviceStudentPage.html");
// }

// export async function adminLogin(adminEmail, adminPassword) {
//     const usersRef = collection(db, "serviceAdmins");
//     const q = query(usersRef, where("email", "==", adminEmail));
//     const querySnapshot = await getDocs(q);
//     if (!querySnapshot.empty) {
//         const userDoc = querySnapshot.docs[0];
//         var uid = userDoc.id;
//     } else {
//         console.log("Incorrect email.");
//         alert("Incorrect email.");
//         return;
//     }
//
//     const docRef = doc(db, "serviceAdmins", uid);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//         const actualAdminPassword = docSnap.data().password;
//         if (adminPassword === actualAdminPassword) {
//             createAuthenticationCookie("serviceAdminAuth", 30);
//             location.replace("serviceAdminPanel.html");
//         }
//         else {
//             console.log("wrong username/password");
//             alert("Wrong Username or Password");
//         }
//     }
//     else {
//         console.log("Student not found");
//         alert("Student not found");
//     }
// }

// admin login function
console.log("loaded!")
export const adminLogin = function () {
    console.log("Admin login function called with email: " + adminEmail);
}
window.adminLogin = adminLogin;