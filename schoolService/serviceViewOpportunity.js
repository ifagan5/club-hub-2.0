import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, getDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, Timestamp, query, where} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import {checkAdminStatus, checkLoginStatus} from "./serviceAuth.js";


const isLoggedIn = await checkLoginStatus()
if (isLoggedIn === false) {
    window.location.href = "serviceStudentLogin.html";
}

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

// Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const opportunityName = document.getElementById("opportunityName");
const opportunityDescription = document.getElementById("opportunityDescription");
const opportunityLength = document.getElementById("opportunityLength");
const opportunityDate = document.getElementById("opportunityDate");
const opportunityTime = document.getElementById("opportunityTime");
const opportunityLocation = document.getElementById("opportunityLocation");

// testing...
// localStorage.setItem("serviceName", "setme")

const docsRef = collection(db, "serviceOpportunities");
const serviceName = sessionStorage.getItem('opportunityName');
console.log(serviceName);
const q = query(docsRef, where("opportunityName", "==", serviceName));
const querySnapshot = await getDocs(q);
if (!querySnapshot.empty) {
    querySnapshot.forEach((doc) => {
        const data = doc.data();

        opportunityName.innerHTML = data.opportunityName;
        opportunityDescription.innerHTML = data.opportunityDescription;
        opportunityLength.innerHTML = data.opportunityLength;
        opportunityDate.innerHTML = data.opportunityDate;
        opportunityTime.innerHTML = data.opportunityTime;
        opportunityLocation.innerHTML = data.opportunityLocation;
    });
} else {
    opportunityName.innerHTML = "Error: No Opportunity Found";
}