import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, getDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, Timestamp} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
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




export async function sLogin(user, pass){
  
}


export async function sLogin() {
  const clubId = sessionStorage.getItem("student");
  const enteredPassword = localStorage.getItem("password");

  const docRef = doc(db, "students", clubId);
  const docSnap = await getDoc(docRef);

  localStorage.setItem("canEdit", "false");

  if (docSnap.exists()) {
    const studentData = docSnap.data();
    if (enteredPassword === studentData.password) {
      console.log("club login working");
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
    console.log("Club not found");
    alert("Club not found");
    localStorage.setItem("clubAuth", "false");
  }
}