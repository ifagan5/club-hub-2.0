import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
// TODO: import libraries for Cloud Firestore Database
// https://firebase.google.com/docs/firestore
import { getFirestore, collection, collectionGroup, addDoc, getDocs,getDoc, doc, updateDoc, deleteDoc, setDoc, Timestamp, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import {updatePoints} from "./leaderboardScore.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const auth = getAuth(app);


export async function sLogin() {
    const studentId = sessionStorage.getItem("email");
    const enteredPassword = localStorage.getItem("password");
  
    const docRef = doc(db, "students", clubId);
    const docSnap = await getDoc(docRef);
  
    localStorage.setItem("canEdit", "false");
  
    if (docSnap.exists()) {
      const studentData = docSnap.data();
      if (enteredPassword === studentData.password) {
        console.log("student login working");
        //keeps user loged in for 2 weeks on the device they are using
        const expiryTime = Date.now() + 14 * 24 * 60 * 60 * 1000;
        localStorage.setItem("loginExpiry", expiryTime.toString());
        alert('You will remaine logged in for two weeks, so please make sure you log out if this is a shared device!')
        localStorage.setItem("clubAuth", "true"); // set before redirect
        location.replace("clubDash.html");
      } 
      else {
        console.log("wrong username/password");
        localStorage.setItem("clubAuth", "false");
        alert("Wrong Username or Password");
      }
    } 
    else {
      console.log("Student ID not found");
      alert("StudentID not found");
      localStorage.setItem("clubAuth", "false");
    }
  }