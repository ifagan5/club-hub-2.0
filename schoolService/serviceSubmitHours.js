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

export const addLog = async function(hours, toSchool, description, contact, date){
    const user = await getCurrentUser()
    const uid = user.uid;
    console.log(uid);
    const docRef = doc(db, "students", uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    if (docSnap.exists()) {
        const studentTotalHours = data.totalHours || 0; // Default to 0 if it doesn't exist?
        const newHours = parseFloat(studentTotalHours) + parseFloat(hours);
        await updateDoc(docRef, {
            totalHours: newHours,
        });

        const studentSchoolHours = data.totalSchoolHours || 0 // Default to 0 if it doesn't exist?
        const newSchoolHours = parseFloat(studentSchoolHours) + parseFloat(toSchool);
        await updateDoc(docRef, { // Fix: Update totalSchoolHours instead of totalHours
            totalSchoolHours: newSchoolHours,
        });
    }


    const serviceLogCollectionRef = collection(db, "studentServiceLog", uid, "logs");
    const logEntry = {
        hours: hours,
        schoolServiceHours: toSchool,
        description: description,
        contact: contact,
        date: date,
        timestamp: Timestamp.now(), // Add a server-side timestamp
    };

    await addDoc(serviceLogCollectionRef, logEntry);




    // const totalHours = user.hoursCompleted;
    // user.hoursCompleted = totalHours + hours;
    // const docFetched= await getDoc(docRef);
    // const numFields= Object.keys(docFetched.data()).length;
    // const numLogs = numFields - 4;
    // await updateDoc(docRef, {
    //     [`log${numLogs}`]: {logNum: numLogs, totalHours: hours, toSchoolHours: toSchool, workDescription: description, contactPerson: contact, dateCompleted: date},
    // });
    //   window.location.href = "serviceStudentPage.html";
}

export async function getTotalHours(){
    const user = await getCurrentUser();
    return user.hoursCompleted;
}