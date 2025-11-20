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
<<<<<<< Updated upstream
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
        // The previous line was trying to get a subcollection of a document, but it should be getting the document itself.
        // To get a specific document, use `doc` instead of `collection` and then `getDoc`.
        let docRef = doc(db, "studentServiceLog", uid, "logs", documentUID);
        let docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            let contact = docSnap.data().contact;
            let date = docSnap.data().dateCompleted;
            let description = docSnap.data().description;
            let hours = docSnap.data().totalHours;
            let schoolServiceHours = docSnap.data().toSchoolHours;
            let timestamp = docSnap.data().timestamp;
            console.log(docSnap.data());

            // Get the original elements from the HTML
            const originalDiv = document.getElementById('log1'); // Assuming 'log1' is the ID of the first log entry container
            const originalAct = document.getElementById('activity');
            const originalHr = document.getElementById('logged-hours');
            const originalHrSchool = document.getElementById('logged-hours-to-school');
            const originalDate = document.getElementById('date');
            const originalContact = document.getElementById('contact');

            // For the first log entry, directly update the original elements
            if (i === 0) {
                document.getElementById("activity").innerText = "Activity: " + description;
                document.getElementById("logged-hours").innerText = "Total Hours Logged: " + hours;
                document.getElementById("logged-hours-to-school").innerText = "Service to School Hours: " + schoolServiceHours;
                document.getElementById("date").innerText = "Date Completed: " + date;
                document.getElementById("contact").innerText = "Contact Person: " + contact;
                document.getElementById('log1').appendChild(document.createElement('br'));
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
                originalDiv.parentNode.appendChild(document.createElement('br'));

            }
        }
=======
    const docRef = await doc(db, "students", uid);
    const docSnap= await getDoc(docRef);
    if (docSnap.exists()) {
        const data = await docSnap.data();
        const nestedMap = await data[`log${num}`]; // Assuming 'yourMapField' is the key of the map
        if (nestedMap) {
          const specificValue = await nestedMap.workDescription; // Assuming 'specificField' is the key within the map
          console.log("Work Description:", specificValue);
          return specificValue;
        }
      } else {
        console.log("No such document!");
      }

}

export const getLogHours = async function(num){
    const user = await getCurrentUser()
    const uid = user.uid;
    const docRef = await doc(db, "students", uid);
    const docSnap= await getDoc(docRef);
    if (docSnap.exists()) {
        const data = await docSnap.data();
        const nestedMap = await data[`log${num}`]; // Assuming 'yourMapField' is the key of the map
        if (nestedMap) {
          const specificValue = await nestedMap.totalHours; // Assuming 'specificField' is the key within the map
          console.log("Total Hours:", specificValue);
          return specificValue;
        }
      } else {
        console.log("No such document!");
      }

}

export const getLogHoursToSchool = async function(num){
    const user = await getCurrentUser()
    const uid = user.uid;
    console.log(uid);
    const docRef = await doc(db, "students", uid);
    const docSnap= await getDoc(docRef);
    if (docSnap.exists()) {
        const data = await docSnap.data();
        const nestedMap = await data[`log${num}`]; // Assuming 'yourMapField' is the key of the map
        if (nestedMap) {
          const specificValue = await nestedMap.toSchoolHours; // Assuming 'specificField' is the key within the map
          console.log("Hours to School:", specificValue);
          return specificValue;
        }
      } else {
        console.log("No such document!");
      }

      
}

export const getLogDate = async function(num){
    const user = await getCurrentUser()
    const uid = user.uid;
    console.log(uid);
    const docRef = await doc(db, "students", uid);
    const docSnap= await getDoc(docRef);
    if (docSnap.exists()) {
        const data = await docSnap.data();
        const nestedMap = await data[`log${num}`]; // Assuming 'yourMapField' is the key of the map
        if (nestedMap) {
          const specificValue = await nestedMap.dateCompleted; // Assuming 'specificField' is the key within the map
          console.log("Date Completed:", specificValue);
          return specificValue;
        }
      } else {
        console.log("No such document!");
      }

}

export const getLogContact = async function(num){
    const user = await getCurrentUser()
    const uid = user.uid;
    console.log(uid);
    const docRef = await doc(db, "students", uid);
    const docSnap= await getDoc(docRef);
    if (docSnap.exists()) {
        const data = await docSnap.data();
        const nestedMap = await data[`log${num}`]; // Assuming 'yourMapField' is the key of the map
        if (nestedMap) {
          const specificValue = await nestedMap.contactPerson; // Assuming 'specificField' is the key within the map
          console.log("Contact Person:", specificValue);
          return specificValue;
        }
      } else {
        console.log("No such document!");
      }

}

export const makeLog = async function(){
    //getting num of logs
    const user = await getCurrentUser()
    const uid = user.uid;
    console.log(uid);
    const docRef = doc(db, "students", uid);
    const docFetched= await getDoc(docRef);
    const numFields= Object.keys(docFetched.data()).length;
    const num = numFields - 4;

    //getting the original divs
   let originalDiv = document.getElementById('log1');
   const originalAct = document.getElementById('activity');
   const originalHr = document.getElementById('logged-hours');
   const originalHrSchool = document.getElementById('logged-hours-to-school');
   const originalDate = document.getElementById('date');
   const originalContact = document.getElementById('contact');
   for (let i = 1; i <= num; i++){
    console.log("for loop called");
    if(i==1){
        document.getElementById("activity").innerText = "Activity: " + getLogActivity(i);
        document.getElementById("logged-hours").innerText = "Total Hours Logged: " + getLogHours(i);
        document.getElementById("logged-hours-to-school").innerText = "Service to School Hours: " + getLogHoursToSchool(i);
        document.getElementById("date").innerText = "Date Completed: " + getLogDate(i);
        document.getElementById("contact").innerText = "Contact Person: " + getLogContact(i);
>>>>>>> Stashed changes
    }
}