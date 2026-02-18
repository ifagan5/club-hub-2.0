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

export const updateServiceOpportunity = async function(){
    const logFormId = document.getElementById("editForm");
    if (!logFormId.checkValidity()) {
        logFormId.reportValidity();
        return;
    }

    const opportunityId = sessionStorage.getItem('opportunityIDToEdit');
    const opportunityRef = doc(db, "serviceOpportunities", opportunityId);

    const updatedEntry = {
        opportunityName: document.getElementById('opportunityName').value,
        opportunityDescription: document.getElementById('opportunityDescription').value,
        opportunityLength: document.getElementById('opportunityLength').value,
        opportunityDate: document.getElementById('opportunityDate').value,
        opportunityTime: document.getElementById('opportunityTime').value,
        opportunityLocation: document.getElementById('opportunityLocation').value,
        lastUpdated: Timestamp.now(),
    };

    await updateDoc(opportunityRef, updatedEntry);
    window.location.href = "serviceAdminPanel.html";
};

const opportunityId = sessionStorage.getItem('opportunityIDToEdit');
const opportunityRef = doc(db, "serviceOpportunities", opportunityId);
const docSnap = await getDoc(opportunityRef);

if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById('opportunityName').value = data.opportunityName;
    document.getElementById('opportunityDescription').value = data.opportunityDescription;
    document.getElementById('opportunityLength').value = data.opportunityLength;
    document.getElementById('opportunityDate').value = data.opportunityDate;
    document.getElementById('opportunityTime').value = data.opportunityTime;
    document.getElementById('opportunityLocation').value = data.opportunityLocation
}
