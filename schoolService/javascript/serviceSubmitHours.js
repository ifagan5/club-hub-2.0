import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, collectionGroup, addDoc, getDocs,getDoc, doc, updateDoc, deleteDoc, setDoc, Timestamp, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import {updatePoints} from "./leaderboardScore.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , updateDoc, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

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
    const user = userCredential.user;
    const uid = user.uid;
    const docRef = doc(db, "students", uid);
    // Source - https://stackoverflow.com/a
    // Posted by aran
    // Retrieved 2025-11-11, License - CC BY-SA 4.0
  const docFetched= await getDoc(docRef);
  const numFields= Object.keys(docFetched.data()).length;
  const numLogs = numFields - 4;

    await updateDoc(docRef, {
        log: ["Log " + numLogs, hours, description, contact, date]
    });

    await updateDoc(docRef, {
        [log]: "Log " + numLogs
      })
      .then(() => {
        console.log("Document successfully updated with dynamic field name!");
      })
      .catch((error) => {
        console.error("Error updating document:", error);
      });


}