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

const checkbox = document.getElementById("reoccurringEventCheckbox");
const form = document.getElementById("opportunityForm");

// allows creation of a service opportunity
/*
createServiceOpportunity(opportunityName, opportunityDescription, opportunityLength, opportunityDate, opportunityTime, opportunityLocation)
Creates an opportunity where
opportunityName: opportunityName,
opportunityDescription :opportunityDescription,
opportunityLength: opportunityLength,
opportunityDate: opportunityDate,
opportunityTime: opportunityTime,
opportunityLocation: opportunityLocation,
timestamp: Timestamp.now()
based on the user inputs
*/
export const createServiceOpportunity = async function(opportunityName, opportunityDescription, opportunityLength, opportunityDate, opportunityTime, opportunityContact, opportunityLocation){
    const logFormId = document.getElementById("loginForm");
    if (!logFormId.checkValidity()) {
        logFormId.reportValidity();
        return;
    }

    const opportunityRef = collection(db, "serviceOpportunities");

    const serviceOpportunityEntry = {
        opportunityName: opportunityName,
        opportunityDescription :opportunityDescription,
        opportunityLength: opportunityLength,
        opportunityDate: opportunityDate,
        opportunityTime: opportunityTime,
        opportunityContact: opportunityContact,
        opportunityLocation: opportunityLocation,
        timestamp: Timestamp.now(), // Add a server-side timestamp
    };

    let days = [];
    if (!checkbox.checked) {
        await addDoc(opportunityRef, serviceOpportunityEntry);
        window.location.href = "serviceAdminPanel.html";
    } else {
        for (let i = 1; i <= 7; i++) {
            const element = document.getElementById("cb-" + i);
            if (element.checked) {
                days.push(i);
            }
        }

        const numRepeat = document.getElementById("repeatTimes").value;

        const earliestDay = Math.min(...days); // returns the numeric timestamps for earliest day on the list after reading list with ...
        let startDate = new Date();
        const currentDayOfWeek = startDate.getDay() === 0 ? 7 : startDate.getDay();
        startDate.setDate(startDate.getDate() + (earliestDay - currentDayOfWeek + 7) % 7);

        for (let week = 0; week < numRepeat; week++) {
            for (const day of days) {
                const dateObj = new Date(startDate);
                dateObj.setDate(dateObj.getDate() + (week * 7) + (day - earliestDay));

                const newServiceOpportunityEntry = {
                    opportunityName: opportunityName,
                    opportunityDescription :opportunityDescription,
                    opportunityLength: opportunityLength,
                    opportunityDate: dateObj.toISOString().split('T')[0], // also from google because timestamps weird
                    opportunityTime: opportunityTime,
                    opportunityContact: opportunityContact,
                    opportunityLocation: opportunityLocation,
                    timestamp: Timestamp.now(), // Add a server-side timestamp
                };
                await addDoc(opportunityRef, newServiceOpportunityEntry);
            }
        }
        window.location.href = "serviceAdminPanel.html";
    }
}

const dateInput = document.getElementById("opportunityDate");
const opportunityDateLabel = document.getElementById("opportunityDateLabel");
checkbox.addEventListener('change', (event) => {
    if (event.target.checked) {
        form.style.display = "block";
        dateInput.style.display = "none";
        opportunityDateLabel.style.display = "none";
    } else {
        form.style.display = "none";
        dateInput.style.display = "block";
        opportunityDateLabel.style.display = "block";
    }
});
