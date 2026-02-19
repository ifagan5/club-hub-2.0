import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, collectionGroup, addDoc, getDocs,getDoc, doc, updateDoc, deleteDoc, setDoc, Timestamp, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {loginUser, checkLoginStatus, checkAdminStatus, checkLoginStatusNoRedirect} from "./serviceAuth.js";

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

// kick the user off the page is they should not be here
(async () => {
    const isUser = await checkLoginStatusNoRedirect();
    if (isUser === true) {
        window.location.href = "./serviceStudentPage.html";
    }
})();

/*
sLogin(email, password)
log the user in by calling serviceauth function
*/
export async function sLogin(email, password) {
    const logFormId = document.getElementById("loginForm");
    if (!logFormId.checkValidity()) {
        logFormId.reportValidity();
        return;
    }

    await loginUser(email, password);
    alert(await checkAdminStatus());
  }

