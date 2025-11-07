import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, getDoc, where, getDocs, doc, updateDoc, deleteDoc, setDoc, Timestamp ,addDoc, query} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
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
const auth = getAuth(app);

export const registerService = async function(email, pass, first, last){

   try {
       await createUserWithEmailAndPassword(auth, email, pass);
   } catch (error) {
       console.log("Error signing up: ", error);
   }


   await signInWithEmailAndPassword(auth, email, pass);
   onAuthStateChanged(auth, (user) => {
       if (user) {
           const uid = user.id;
           console.log("Logged in user: " + uid)
       } else {
           console.log("No user is logged in.")
       }
   });
    
    // try {
    //    const uid = user.id;
    //     const docRef = await addDoc(collection(db, "students", uid), {
    //         password: pass,
    //         email: email,
    //         firstName: first,
    //         lastName: last
    //     });
    //
    //     localStorage.setItem("email", email);
    //     localStorage.setItem("password", pass);
    //     localStorage.setItem("firstName", first);
    //     localStorage.setItem("lastName", last);
    //     // switches page to more information page beyond registration page
    //     // window.location.href="serviceStudentPage.html";
    // } catch (error) {
    //     console.error("Error registering service:", error);
    // }

    
}

registerService("jorhndwergoe@exmaple.com", "password", "John", "Doe")
