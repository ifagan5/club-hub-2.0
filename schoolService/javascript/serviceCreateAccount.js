import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, getDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, Timestamp} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: "AIzaSyDKBBs0TWerQno_u8yjNqV5qmvQImf6xA0",
    authDomain: "club-hub-2.firebaseapp.com",
    projectId: "club-hub-2",
    storageBucket: "club-hub-2.firebasestorage.app",
    messagingSenderId: "339870020143",
    appId: "1:339870020143:web:cc698c287ed642e3798cda",
    measurementId: "G-P97ML6ZP15"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const registerService = async function(user, pass){

      const q = query(collection(db, "students"), where("username", "==", user));

      const snapshot = await getCountFromServer(q);
      console.log(snapshot.data().count);
      console.log("hello");
      // testing if username exists
      if(snapshot.data().count != 0){
        console.log("hiiii");
        console.log("username exists");
        // alert!!
          alert("An account with this email already exists. Please try again.");
          // stops function so that club cannot create an account with an already-in-use username
          return;
      }
    
          console.log(user);
      // saving username across pages
      localStorage.setItem("username", user);
      localStorage.setItem("password", pass)
      // switches page to more information page beyond registration page
      window.location.href="serviceStudentPage.html";
      
    }