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

export const registerService = async function(email, pass, first, last){
    //gets the user input from the form
    const logFormId = document.getElementById("createAccountForm");
    if (!logFormId.checkValidity()) {
        logFormId.reportValidity();
        return;
    }

    // stack over flow lookup for how to remove all non numebr charaacters from string
    const newGradYear = email.replace(/\D/g, '') || "99";
    const newGradYearFinal = "20" + newGradYear;
    alert(newGradYearFinal);

    const full_name = first + " " + last;
    // Helper to normalize case (e.g., "jake" -> "Jake") from stack overflow
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    // Split the input into first name and last name using spaces also from stack overflow
    const [firstName, ...lastNameParts] = full_name.split(" ");
    const formattedLastName = lastNameParts.map(capitalize).join(" ");
    const formattedFirstName = capitalize(firstName);
    alert(formattedFirstName);
    alert(formattedLastName);
    //creates the account using the user input. 
    await createUser(email, pass, formattedFirstName, formattedLastName, newGradYearFinal);
}

export const theFlood = async function() {
    const queryRef = query(collection(db, "students"));
    const snapshot = await getDocs(queryRef);
    for (const item of snapshot.docs) {
        await deleteDoc(doc(db, "students", item.id));
    }
    
};
// theFlood()
