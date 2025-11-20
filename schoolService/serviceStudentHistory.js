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
    }
}
}