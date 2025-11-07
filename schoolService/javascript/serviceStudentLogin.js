import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, collectionGroup, addDoc, getDocs,getDoc, doc, updateDoc, deleteDoc, setDoc, Timestamp, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import {updatePoints} from "./leaderboardScore.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

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
// const loginButton = document.getElementById("loginButton");
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export const studentLogin = async function() {
    const email = document.getElementById("email");
    const pass = document.getElementById("password");
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        window.location.href = "../pages/serviceStudentPage.html";
    }
    catch(e) {
        console.log("Error logging in: " + e);
    }
}

const button = document.getElementById("THEBUTTON");
button.addEventListener("click", studentLogin);