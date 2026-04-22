import {initializeApp} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getFirestore,
    Timestamp,
    updateDoc,
    getCountFromServer
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import {checkAdminStatus, checkLoginStatus, getCurrentUser} from "./serviceAuth.js";

// code to kick the users off the pages if they are not in the right section
(async () => {
const isLoggedIn = await checkLoginStatus();
if (!isLoggedIn) {
    window.location.href = "./serviceStudentLogin.html";
}
const isAdmin = await checkAdminStatus()
    if (isAdmin) {
        window.location.href = "./serviceAdminPanel.html";
    }
})();
//firebase config
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

// add a log to the service hours if we want to
/*
addLog(hours, toSchool, description, contact, date)
adds a log to the student's logs with the input information and updates all hours totals
changes the location to serviceStudentPage.html
*/
export const addLog = async function(hours, hoursType, description, contact, date){
    const logFormId = document.getElementById("logForm");
    if (!logFormId.checkValidity()) {
        logFormId.reportValidity();
        return;
    }

    // do code stuff
    const user = await getCurrentUser()
    const uid = user.uid;
    console.log(uid);
    const docRef = doc(db, "students", uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    if (docSnap.exists()) {
        if (hoursType === "General Community Service") {
            const studentTotalGeneralHours = data.totalGeneralHours || 0; // Default to 0 if it doesn't exist?
            const newHours = parseFloat(String(studentTotalGeneralHours)) + parseFloat(String(hours));
            await updateDoc(docRef, {
                totalGeneralHours: newHours,
            });
        } else if (hoursType === "Service to the School") {
            const studentTotalSchoolHours = data.totalSchoolHours || 0 // Default to 0 if it doesn't exist?
            const newHours = parseFloat(studentTotalSchoolHours) + parseFloat(hours);
            await updateDoc(docRef, { // Fix: Update totalSchoolHours instead of totalHours
                totalSchoolHours: newHours,
            });
        } else {
            alert("ERROR - input type not recognized");
            alert(hoursType);
        }
    }


    const serviceLogCollectionRef = collection(db, "studentServiceLog", uid, "logs");
    const countSnap = await getCountFromServer(serviceLogCollectionRef);
    const i = countSnap.data().count;
    const logEntry = {
        //uid: [`log${snapshot.data().count}`],
        logNum: i+1,
        hours: hours,
        schoolServiceHours: hoursType,
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