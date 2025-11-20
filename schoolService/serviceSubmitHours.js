import {initializeApp} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getFirestore,
    Timestamp,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
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
    //const i = query(serviceLogCollectionRef, count());
    //const snapshot = await getAggregate(i);
    const logEntry = {
        //uid: [`log${snapshot.data().count}`],
        hours: hours,
        schoolServiceHours: toSchool,
        description: description,
        contact: contact,
        date: date,
        timestamp: Timestamp.now(), // Add a server-side timestamp
    };

    await addDoc(serviceLogCollectionRef, logEntry);

  window.location.href = "serviceStudentPage.html";
}

// export async function getTotalHours(){
//     const user = await getCurrentUser()
//     const uid = user.uid;
//     console.log(uid);
//     const docRef = doc(db, "students", uid);
//     const docSnap = await getDoc(docRef);
//     const data = docSnap.data();
//     if (docSnap.exists()) {
//         return data.totalSchoolHours || 0;
//     }
//     return null;
// }