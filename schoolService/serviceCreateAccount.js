import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, getDoc, where, getDocs, doc, updateDoc, deleteDoc, setDoc, Timestamp ,addDoc, query} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import {createUser} from "./serviceAuth.js";
// See: https://firebase.google.com/docs/web/learn-more#config-object
export const firebaseConfig = {
    apiKey: "AIzaSyDKBBs0TWerQno_u8yjNqV5qmvQImf6xA0",
    authDomain: "club-hub-2.firebaseapp.com",
    projectId: "club-hub-2",
    storageBucket: "club-hub-2.firebasestorage.app",
    messagingSenderId: "339870020143",
    appId: "1:339870020143:web:cc698c287ed642e3798cda",
    measurementId: "G-P97ML6ZP15"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export const registerService = async function(email, pass, first, last, entered){
    //gets the user input from the form
    const logFormId = document.getElementById("createAccountForm");
    if (!logFormId.checkValidity()) {
        logFormId.reportValidity();
        return;
    }

    // stack over flow lookup for how to remove all non numebr charaacters from string
    const newGradYear = email.replace(/\D/g, '') || "99";
    const newGradYearFinal = "20" + newGradYear;

    // Helper to normalize case (e.g., "jake" -> "Jake") from stack overflow
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const formattedFirstName = first.split(" ").map(capitalize).join(" ");
    const formattedLastName = last.split(" ").map(capitalize).join(" ");
    //creates the account using the user input. 
    const gradeEntered = entered;
    await createUser(email, pass, formattedFirstName, formattedLastName, newGradYearFinal, gradeEntered);
}


