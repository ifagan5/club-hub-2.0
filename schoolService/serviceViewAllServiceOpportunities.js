import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, arrayUnion, getCountFromServer, collection, collectionGroup, addDoc, getDocs,getDoc, doc, updateDoc, deleteDoc, setDoc, Timestamp, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {checkLoginStatus, getCurrentUser} from "./serviceAuth.js";
//import{getCountFromServer} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

(async () => {
    const isLoggedIn = await checkLoginStatus();
    if (!isLoggedIn) {
        window.location.href = "./serviceStudentLogin.html";
    }
})();
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

const opportunityButton = document.getElementById("opportunityButton");
if (opportunityButton) {
    opportunityButton.style.backgroundColor = "white";
    opportunityButton.style.color = "maroon";
}

export const getLogActivity = async function() {
    // NEW LOOP
    const logsRef = collection(db, "serviceOpportunities");
    const docSnap = await getDocs(logsRef);
    const originalDiv = document.getElementById('opportunity1');
    originalDiv.style.backgroundColor = "rgb(141,13,24)";
    originalDiv.style.color = "rgb(243, 232, 234)";
    originalDiv.style.padding = " 15px 15px";
    originalDiv.style.borderRadius = "15px";
    originalDiv.style.marginBottom = "15px";
    originalDiv.style.width = "85%";
    const clonedDiv = originalDiv.cloneNode(true);
    const docIds = [];
    const querySnapshot = await getDocs(logsRef);
    querySnapshot.forEach((doc) => {
        docIds.push(doc.id);
    });
    for (const id of docIds) {
        console.log(id);
        const docRef = doc(db, "serviceOpportunities", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log(docSnap.data());
            const data = docSnap.data();
            clonedDiv.id = `opportunity${id}`;
            clonedDiv.querySelector('#opportunityName').id = `opportunityName${id}`;
            clonedDiv.querySelector('#opportunityDescription').id = `opportunityDescription${id}`;
            clonedDiv.querySelector('#opportunityLength').id = `opportunityLength${id}`;
            clonedDiv.querySelector('#opportunityDate').id = `opportunityDate${id}`;
            clonedDiv.querySelector('#opportunityTime').id = `opportunityTime${id}`;
            clonedDiv.querySelector('#opportunityLocation').id = `opportunityLocation${id}`;
            clonedDiv.querySelector('#opportunityButton').id = `opportunityButton${id}`;

            // Update text content of the cloned elements
            clonedDiv.querySelector(`#opportunityName${id}`).innerText = "Name: " + data.opportunityName;
            clonedDiv.querySelector(`#opportunityDescription${id}`).innerText = "Description: " + data.opportunityDescription;
            clonedDiv.querySelector(`#opportunityLength${id}`).innerText = "Length: " + data.opportunityLength;
            clonedDiv.querySelector(`#opportunityDate${id}`).innerText = "Date: " + data.opportunityDate;
            clonedDiv.querySelector(`#opportunityTime${id}`).innerText = "Time: " + data.opportunityTime;
            clonedDiv.querySelector(`#opportunityLocation${id}`).innerText = "Location: " + data.opportunityLocation;
            clonedDiv.querySelector(`#opportunityButton${id}`).innerText = "Sign Up For Opportunity";
            clonedDiv.querySelector(`#opportunityButton${id}`).onclick = () => {
                sessionStorage.setItem("opportunityName", data.opportunityName);
                window.location.href = "./serviceViewOpportunity.html";
            };

            // Append the cloned div to the parent of the original div
            originalDiv.parentNode.appendChild(clonedDiv);
        }

        const opportunityButton = document.getElementById("opportunityButton");
        if (opportunityButton) {
            opportunityButton.style.backgroundColor = "white";
            opportunityButton.style.color = "maroon";
        }

    }
}