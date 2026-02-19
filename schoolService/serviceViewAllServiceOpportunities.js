import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, arrayUnion, getCountFromServer, collection, collectionGroup, addDoc, getDocs,getDoc, doc, updateDoc, deleteDoc, setDoc, Timestamp, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {checkLoginStatus, getCurrentUser, checkAdminStatus} from "./serviceAuth.js";
//import{getCountFromServer} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// kicked our person if they should not be logged in
(async () => {
    const loggedIn = await checkLoginStatus();
    if (!loggedIn) {
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

// find and set button css because i hate touching css in .css documents its scary
const opportunityButton = document.getElementById("opportunityButton");
if (opportunityButton) {
    opportunityButton.style.backgroundColor = "white";
    opportunityButton.style.color = "maroon";
}

// const isAdmin = await checkAdminStatus();
// if (isAdmin) {
// }

// get all the log activity
export const getLogActivity = async function() {
    // NEW LOOP AURA
    const logsRef = collection(db, "serviceOpportunities");
    const originalDiv = document.getElementById('opportunity1');
    originalDiv.style.display = 'none';
    const q = query(collection(db, "serviceOpportunities"), orderBy("opportunityDate", "desc"));
    const querySnapshot = await getDocs(q);
    for (const docSnap of querySnapshot.docs) {
        if (docSnap.exists()) {
            const data = docSnap.data();

            // check if oppertunity is old
            const timestamp = new Date(`${data.opportunityDate}T${data.opportunityTime}`);
            const currentDate = new Date();
            const timestampDate = new Date(timestamp);
            const currentDateTimeInMs = currentDate.getTime();
            const timestampDateTimeInMs = timestampDate.getTime();
            console.log("currentDateTimeInMs: " + currentDateTimeInMs);
            console.log("timestampDateTimeInMs: " + timestampDateTimeInMs);
            const differenceTimeInMs = currentDateTimeInMs - timestampDateTimeInMs;
            const isPast = differenceTimeInMs > 0 && differenceTimeInMs > 1210000000;

            // delete if past 14 days
            if (isPast) {
                console.log("MUST DELETE: " + data.opportunityName);
                await deleteDoc(doc(db, "serviceOpportunities", docSnap.id));
                window.location.reload();
                continue;
            }

            if (sessionStorage.getItem("filterBySignedUp") === "true") {
                const user = await getCurrentUser();
                if (!data.signedUpUsers || !data.signedUpUsers.includes(user.uid)) {
                    continue;
                }
            }

            // do some div cloning
            const clonedDiv = originalDiv.cloneNode(true);
            clonedDiv.style.display = 'block';
            clonedDiv.style.backgroundColor = "rgb(141,13,24)";
            clonedDiv.style.color = "rgb(243, 232, 234)";
            clonedDiv.style.padding = " 15px 15px";
            clonedDiv.style.borderRadius = "15px";
            clonedDiv.style.marginBottom = "15px";
            clonedDiv.style.width = "85%";

            const id = docSnap.id;
            clonedDiv.id = `opportunity${id}`;
            clonedDiv.querySelector('#opportunityName').id = `opportunityName${id}`;
            clonedDiv.querySelector('#opportunityDescription').id = `opportunityDescription${id}`;
            clonedDiv.querySelector('#opportunityLength').id = `opportunityLength${id}`;
            clonedDiv.querySelector('#opportunityDate').id = `opportunityDate${id}`;
            clonedDiv.querySelector('#opportunityTime').id = `opportunityTime${id}`;
            clonedDiv.querySelector('#opportunityLocation').id = `opportunityLocation${id}`;
            const button = clonedDiv.querySelector('#opportunityButton');
            button.id = `opportunityButton${id}`;

            // Update text content of the cloned elements
            clonedDiv.querySelector(`#opportunityName${id}`).textContent = "Name: " + data.opportunityName;
            clonedDiv.querySelector(`#opportunityDescription${id}`).textContent = "Description: " + data.opportunityDescription;
            clonedDiv.querySelector(`#opportunityLength${id}`).textContent = "Length: " + data.opportunityLength;
            clonedDiv.querySelector(`#opportunityDate${id}`).textContent = "Date: " + data.opportunityDate;
            clonedDiv.querySelector(`#opportunityTime${id}`).textContent = "Time: " + data.opportunityTime;
            clonedDiv.querySelector(`#opportunityLocation${id}`).textContent = "Location: " + data.opportunityLocation;
            button.textContent = "View Service Opportunity";

            // edit some aperiodic if the user is an admin because they should not be able t osign up for service oppertunites
            const isAdmin = await checkAdminStatus();
            if (isAdmin) {
                const checkMarkLabel = document.getElementById("checkMarkLabel");
                const checkMarkBox = document.getElementById("myCheck");
                const checkMarkBreak = document.getElementById("checkMarkBreak");
                checkMarkLabel.style.display = "none";
                checkMarkBox.style.display = "none";
                checkMarkBreak.style.display = "block";

                // button.style.display = "none";
                button.innerText = "Edit Service Opportunity";
                button.onclick = () => {
                    sessionStorage.setItem("opportunityIDToEdit", id);
                    window.location.href = "./serviceEditOpportunity.html";
                };
            } else {
                button.onclick = () => {
                    sessionStorage.setItem("opportunityName", data.opportunityName);
                    window.location.href = "./serviceViewOpportunity.html";
                };
            }

            // Append the cloned div to the parent of the original div
            originalDiv.parentNode.appendChild(clonedDiv);
        }
    }
}

// checkbox javascirpt to filter by signed up service opportunities
const checkbox = document.getElementById('myCheck');
checkbox.checked = sessionStorage.getItem("filterBySignedUp") === "true";
checkbox.addEventListener('change', function() {
    if (this.checked) {
        sessionStorage.setItem("filterBySignedUp", "true");
        window.location.reload();
    } else {
        sessionStorage.removeItem("filterBySignedUp");
        window.location.reload();
    }
});