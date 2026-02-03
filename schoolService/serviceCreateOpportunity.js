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

export const createServiceOpportunity = async function(opportunityName, opportunityDescription, opportunityLength, opportunityDate, opportunityTime, opportunityLocation){
    const opportunityRef = collection(db, "serviceOpportunities");

    const serviceOpportunityEntry = {
        opportunityName: opportunityName,
        opportunityDescription :opportunityDescription,
        opportunityLength: opportunityLength,
        opportunityDate: opportunityDate,
        opportunityTime: opportunityTime,
        opportunityLocation: opportunityLocation,
        timestamp: Timestamp.now(), // Add a server-side timestamp
    };

    await addDoc(opportunityRef, serviceOpportunityEntry);

    window.location.href = "serviceAdminPanel.html";
}
