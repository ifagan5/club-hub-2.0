import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, arrayUnion, collection, collectionGroup, addDoc, getDocs,getDoc, doc, updateDoc, deleteDoc, setDoc, Timestamp, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {checkLoginStatus, getCurrentUser} from "./serviceAuth.js";

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

export const getLogActivity = async function() {
    const user = await getCurrentUser()
    const uid = user.uid;
    console.log(uid);
    const logsRef = collection(db, "studentServiceLog", uid, "logs");
    const docSnap = await getDocs(logsRef);
    const docIds = [];
    const querySnapshot = await getDocs(collection(db, "studentServiceLog", uid, "logs"));
    querySnapshot.forEach((doc) => {
        docIds.push(doc.id);
    });
    for (let i = 0; i < docIds.length; i++) {
        let documentUID = docIds[i];
        let docRef = doc(db, "studentServiceLog", uid, "logs", documentUID);
        let docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            let contact = docSnap.data().contact;
            let date = docSnap.data().date;
            let description = docSnap.data().description;
            let hours = docSnap.data().hours;
            let schoolServiceHours = docSnap.data().schoolServiceHours;
            let timestamp = docSnap.data().timestamp;
            console.log(docSnap.data().date);
            console.log(docSnap.data());

            // Get the original elements from the HTML
            const originalDiv = document.getElementById('log1'); // Assuming 'log1' is the ID of the first log entry container
            //STYLING
            originalDiv.style.backgroundColor = "rgb(141,13,24)";
            originalDiv.style.color = "rgb(243, 232, 234)";
            originalDiv.style.padding = " 15px 15px";
            originalDiv.style.borderRadius = "15px";
            originalDiv.style.marginBottom = "15px";
            originalDiv.style.width = "85%";


            if (i === 0) {
                document.getElementById("activity").innerText = "Activity: " + description;
                document.getElementById("logged-hours").innerText = "Total Hours Logged: " + hours;
                document.getElementById("logged-hours-to-school").innerText = "Service to School Hours: " + schoolServiceHours;
                document.getElementById("date").innerText = "Date Completed: " + date;
                document.getElementById("contact").innerText = "Contact Person: " + contact;
            } else {
                // For subsequent log entries, clone the original elements and append them
                const clonedDiv = originalDiv.cloneNode(true);
                clonedDiv.id = `log${i + 1}`; // Update ID for uniqueness
                clonedDiv.querySelector('#activity').id = `activity${i + 1}`;
                clonedDiv.querySelector('#logged-hours').id = `logged-hours${i + 1}`;
                clonedDiv.querySelector('#logged-hours-to-school').id = `logged-hours-to-school${i + 1}`;
                clonedDiv.querySelector('#date').id = `date${i + 1}`;
                clonedDiv.querySelector('#contact').id = `contact${i + 1}`;

                // Update text content of the cloned elements
                clonedDiv.querySelector(`#activity${i + 1}`).innerText = "Activity: " + description;
                clonedDiv.querySelector(`#logged-hours${i + 1}`).innerText = "Total Hours Logged: " + hours;
                clonedDiv.querySelector(`#logged-hours-to-school${i + 1}`).innerText = "Service to School Hours: " + schoolServiceHours;
                clonedDiv.querySelector(`#date${i + 1}`).innerText = "Date Completed: " + date;
                clonedDiv.querySelector(`#contact${i + 1}`).innerText = "Contact Person: " + contact;

                // Append the cloned div to the parent of the original div
                originalDiv.parentNode.appendChild(clonedDiv);

            }
        }
    }
}