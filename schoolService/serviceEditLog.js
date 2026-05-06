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

(async () => {
    const isAdmin = await checkAdminStatus();
    if (!isAdmin) {
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

// allows us to update the service opportunity that the user is currency editing
/*
updateServiceOpportunity()
Edits the opportunity where by changing the field based on the edits the user input, then
replaces the location with serviceAdminPanel.html
*/
export const updateServiceLog = async function(){
    const logFormId = document.getElementById("editForm");
    if (!logFormId.checkValidity()) {
        logFormId.reportValidity();
        return;
    }

    const opportunityId = sessionStorage.getItem('editLogId');
    const studentUserId = sessionStorage.getItem('studentUID');
    const opportunityRef = doc(db, "studentServiceLog", studentUserId, "logs", opportunityId);

    const updatedEntry = {
        description: document.getElementById('description').value,
        date: document.getElementById('date').value,
        contact: document.getElementById('contact').value,
        hours: Number(document.getElementById('hours').value),
        lastUpdated: Timestamp.now(),
    };

    await updateDoc(opportunityRef, updatedEntry);
    window.location.href = "serviceAdminPanel.html";
};

const opportunityId = sessionStorage.getItem('editLogId');
const studentUserId = sessionStorage.getItem('studentUID');
const opportunityRef = doc(db, "studentServiceLog", studentUserId, "logs", opportunityId);
const docSnap = await getDoc(opportunityRef);

if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById('description').value = data.description || data.opportunityDescription || '';

    if (data.hours != null) {
        document.getElementById('hours').value = data.hours;
    } else {
        document.getElementById('hours').value = data.opportunityLength || '';
    }

    document.getElementById('date').value = data.date || data.opportunityDate || '';
    document.getElementById('contact').value = data.contact || data.opportunityContact || '';
}
