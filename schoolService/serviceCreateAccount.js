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
    await createUser(email, pass, formattedFirstName, formattedLastName, newGradYearFinal);

    // let hours = 0;
    // for (let i =0; i < email.length; i++){
    //     let letter = email.substring(i, i+1);
    //     if (letter === "1" || letter === "2" || letter === "3" || letter === "4" || letter === "5" || letter === "6" || letter === "7" || letter === "8" || letter === "9"){
    //         let gradYr = "20" + email.substring(i, i+2);
    //         console.log("gradYr:" + gradYr);
    //         await createUser(email, pass, first, last, gradYr);
    //         break;
    //     }
    // }
}

export const theFlood = async function() {
    const queryRef = query(collection(db, "students"));
    const snapshot = await getDocs(queryRef);
    for (const item of snapshot.docs) {
        await deleteDoc(doc(db, "students", item.id));
    }
    
};
// theFlood()
