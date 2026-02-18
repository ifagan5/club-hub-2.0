import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, getDoc, getDocs, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc, setDoc, Timestamp, query, where} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import {checkAdminStatus, checkLoginStatus, getCurrentUser} from "./serviceAuth.js";


const isLoggedIn = await checkLoginStatus()
if (isLoggedIn === false) {
    window.location.href = "serviceStudentLogin.html";
}

// Firebase config
export const firebaseConfig = {
    apiKey: "AIzaSyDKBBs0TWerQno_u8yjNqV5qmvQImf6xA0",
    authDomain: "club-hub-2.firebaseapp.com",
    projectId: "club-hub-2",
    storageBucket: "club-hub-2.firebasestorage.app",
    messagingSenderId: "339870020143",
    appId: "1:339870020143:web:cc698c287ed642e3798cda",
    measurementId: "G-P97ML6ZP15"
};

// Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const opportunityName = document.getElementById("opportunityName");
const opportunityDescription = document.getElementById("opportunityDescription");
const opportunityLength = document.getElementById("opportunityLength");
const opportunityDate = document.getElementById("opportunityDate");
const opportunityTime = document.getElementById("opportunityTime");
const opportunityLocation = document.getElementById("opportunityLocation");

// testing...
// localStorage.setItem("serviceName", "setme")

const user = await getCurrentUser();
const docsRef = collection(db, "serviceOpportunities");
const serviceName = sessionStorage.getItem('opportunityName');
console.log(serviceName);
const q = query(docsRef, where("opportunityName", "==", serviceName));
const querySnapshot = await getDocs(q);
if (!querySnapshot.empty) {
    for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();

        let finalTime = null;
        const current24htime = data.opportunityTime;
        const [hourStr, minute] = current24htime.split(':', 2);
        const hour = parseInt(hourStr, 10); //make sure to set to base 10
        if (hour > 12) {
            finalTime = (hour - 12) + ':' + minute + ' PM';
        } else if (hour === 12) {
            finalTime = hour + ':' + minute + ' PM';
        } else if (hour === 0) {
            finalTime = '12:' + minute + ' AM';
        } else {
            finalTime = hour + ':' + minute + ' AM';
        }


        opportunityName.innerHTML = data.opportunityName;
        opportunityDescription.innerHTML = data.opportunityDescription;
        opportunityLength.innerHTML = data.opportunityLength + " hours";
        opportunityDate.innerHTML = data.opportunityDate;
        opportunityTime.innerHTML = finalTime;
        opportunityLocation.innerHTML = data.opportunityLocation;

        const button = document.getElementById("opportunityStatusButton");
        const timestamp = new Date(`${data.opportunityDate}T${data.opportunityTime}`);
        console.log(timestamp);
        const signedUpUsers = data.signedUpUsers || [];
        const currentDate = new Date();
        const timestampDate = new Date(timestamp);
        const currentDateTimeInMs = currentDate.getTime();
        const timestampDateTimeInMs = timestampDate.getTime();
        console.log(currentDateTimeInMs)
        console.log(timestampDateTimeInMs)
        const isPast = currentDateTimeInMs > timestampDateTimeInMs;
        console.log(isPast)

        if (signedUpUsers.includes(user.uid)) {
            if (isPast) {
                button.innerText = "Claim Your Service Opportunity Hours";
                button.addEventListener("click", async () => {
                    await updateDoc(doc(db, "serviceOpportunities", docSnap.id), {
                        signedUpUsers: arrayRemove(user.uid)
                    });
                    const uid = user.uid;
                    console.log(uid);
                    const studentDocRef = doc(db, "students", uid);
                    const studentDocSnap = await getDoc(studentDocRef);
                    const studentData = studentDocSnap.data();
                    if (studentDocSnap.exists()) {
                        const studentTotalHours = studentData.totalSchoolHours || 0; // Default to 0 if it doesn't exist?
                        const newHours = Number(studentTotalHours) + Number(data.opportunityLength);
                        alert(newHours);
                        await updateDoc(studentDocRef, {
                            totalSchoolHours: newHours,
                        });
                    }
                    window.location.reload()
                });
            } else {
                button.innerText = "Cancel Your Signup";
                button.addEventListener("click", async () => {
                    await updateDoc(doc(db, "serviceOpportunities", docSnap.id), {
                        signedUpUsers: arrayRemove(user.uid)
                    });
                    window.location.reload()
                });
            }
        } else {
            if (!isPast) {
                button.innerText = "Signup For Service Opportunity";
                button.addEventListener("click", async () => {
                    await updateDoc(doc(db, "serviceOpportunities", docSnap.id), {
                        signedUpUsers: arrayUnion(user.uid)
                    });
                    window.location.reload()
                });
            } else {
                button.innerText = "Service Opportunity Expired";
            }
        }
    }
}
else {
    opportunityName.innerHTML = "Error: No Opportunity Found";
}