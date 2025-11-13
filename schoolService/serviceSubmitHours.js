import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, arrayUnion, collection, collectionGroup, addDoc, getDocs,getDoc, doc, updateDoc, deleteDoc, setDoc, Timestamp, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
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

export const addLog = async function(hours, description, contact, date){
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;
    const docRef = doc(db, "students", uid);
    // Source - https://stackoverflow.com/a
    // Posted by aran
    // Retrieved 2025-11-11, License - CC BY-SA 4.0
    //gets the number of fields the student doc has and subtracts 4 (email, password, fistName, lastName)
    //to get the number of previous logs.
  const docFetched= await getDoc(docRef);
  const numFields= Object.keys(docFetched.data()).length;
  const numLogs = numFields - 4 +1;

  //makes a new field for the log that is an array
  //[log number, hours, description, contact person, date(s) completed]
    await updateDoc(docRef, {
        [`log${numLogs}`]: arrayUnion("Log " + numLogs, hours, description, contact, date),
    });

      //changes page to the student's page
      window.location.href = "serviceStudentPage.html";
}