import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, collectionGroup, addDoc, getDocs,getDoc, doc, updateDoc, deleteDoc, setDoc, Timestamp, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

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
const auth = getAuth(app);

export async function sLogin() {
    const uid = sessionStorage.getItem("student");
    const enteredPassword = localStorage.getItem("password");
    console.log(uid + " " + enteredPassword);
    const docRef = doc(db, "students", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const studentData = docSnap.data();
      if (enteredPassword === studentData.password) {
        console.log("student login working");
        location.replace("serviceStudentPage.html");
      } 
      else {
        console.log("wrong username/password");
        alert("Wrong Username or Password");
      }
    } 
    else {
      console.log("Student not found");
      alert("Student not found");
    }
  }