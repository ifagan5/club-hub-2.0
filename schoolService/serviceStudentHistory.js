import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, arrayUnion, getCountFromServer, collection, collectionGroup, addDoc, getDocs,getDoc, doc, updateDoc, deleteDoc, setDoc, Timestamp, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {checkAdminStatus, checkLoginStatus, getCurrentUser} from "./serviceAuth.js";
//import{getCountFromServer} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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

/* getLogActivity()
prints out each log the student has logged in order from most to least recent.
Each log prints out in a box with the format:
Activity: *entered activity*
Total Hours Logged: *How many hours the student logged*
Service to School Hours: *How many hours were service to the school*
Contact Person: *Entered faculty/adult contact*
Date Completed: *Date the student completed the activity*
*/
export const getLogActivity = async function() {
    
    const user = await getCurrentUser()
    const uid = user.uid;
    console.log(uid);
    const logsRef = collection(db, "studentServiceLog", uid, "logs");
    const docSnap = await getDocs(logsRef);
    const docIds = [];
    const querySnapshot = await getDocs(collection(db, "studentServiceLog", uid, "logs"));
    querySnapshot.forEach((doc) => {
        docIds.push(doc.id);
    });
    //get how many logs the student has and save it as countLogs
    const serviceLogCollectionRef = collection(db, "studentServiceLog", uid, "logs");
    const countSnap = await getCountFromServer(serviceLogCollectionRef);
    const countLogs = countSnap.data().count;
    console.log("countLogs:" + countLogs);

    


    //loops through as many times as logs the student has
    for (let i = countLogs; i >= 1; i--) {
        //loops through as many times as logs the student has until broken
        let index = undefined;
        innerLoop: 
        for(let j = 0; j < countLogs; j++){
            //get the document id at j
            let tempDocumentUID = docIds[j];
            let tempDocRef = doc(db, "studentServiceLog", uid, "logs", tempDocumentUID);
            let tempDocSnap = await getDoc(tempDocRef);
            if (tempDocSnap.exists()) {
                //get what log number this entry is
                let possibleI = tempDocSnap.data().logNum;
                //if it is the one we are looking for break the code
                if(possibleI == i){
                    index = j;
                    //get the document at index j
                    let documentUID = docIds[index];
                        let docRef = doc(db, "studentServiceLog", uid, "logs", documentUID);
                        let docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            let contact = docSnap.data().contact;
                            let date = docSnap.data().date;
                            let description = docSnap.data().description;
                            let hours = docSnap.data().hours;
                            let schoolServiceHours = docSnap.data().schoolServiceHours;
                            let timestamp = docSnap.data().timestamp;
                            console.log(docSnap.data().date);
                            console.log(docSnap.data());

                            // Get the original elements from the HTML
                            const originalDiv = document.getElementById('log1'); // Assuming 'log1' is the ID of the first log entry container
                            //STYLING
                            originalDiv.style.backgroundColor = "rgb(141,13,24)";
                            originalDiv.style.color = "rgb(243, 232, 234)";
                            originalDiv.style.padding = " 15px 15px";
                            originalDiv.style.borderRadius = "15px";
                            originalDiv.style.marginBottom = "15px";
                            originalDiv.style.width = "85%";

                            //for the most recent entry it prints out the information for that entry
                            if (i === countLogs) {
                                document.getElementById("activity").innerText = "Activity: " + description;
                                document.getElementById("logged-hours").innerText = "Non School Hours: " + hours;
                                document.getElementById("logged-hours-to-school").innerText = "Service to School Hours: " + schoolServiceHours;
                                document.getElementById("date").innerText = "Date Completed: " + date;
                                document.getElementById("contact").innerText = "Contact Person: " + contact;
                               // document.getElementById("timestamp").innerText = "Date Logged: " + timestamp;
                            } else {
                                // For subsequent log entries, clone the original elements and append them
                                const clonedDiv = originalDiv.cloneNode(true);
                                clonedDiv.id = `log${i + 1}`; // Update ID for uniqueness
                                clonedDiv.querySelector('#activity').id = `activity${i + 1}`;
                                clonedDiv.querySelector('#logged-hours').id = `logged-hours${i + 1}`;
                                clonedDiv.querySelector('#logged-hours-to-school').id = `logged-hours-to-school${i + 1}`;
                                clonedDiv.querySelector('#date').id = `date${i + 1}`;
                                clonedDiv.querySelector('#contact').id = `contact${i + 1}`;
                                //clonedDiv.querySelector('#timestamp').id = `timestamp${i + 1}`;

                                // Update text content of the cloned elements
                                clonedDiv.querySelector(`#activity${i + 1}`).innerText = "Activity: " + description;
                                clonedDiv.querySelector(`#logged-hours${i + 1}`).innerText = "Non School Hours: " + hours;
                                clonedDiv.querySelector(`#logged-hours-to-school${i + 1}`).innerText = "Service to School Hours: " + schoolServiceHours;
                                clonedDiv.querySelector(`#date${i + 1}`).innerText = "Date Completed: " + date;
                                clonedDiv.querySelector(`#contact${i + 1}`).innerText = "Contact Person: " + contact;
                                //clonedDiv.querySelector(`#timestamp${i + 1}`).innerText = "Date Logged: " + timestamp;

                                // Append the cloned div to the parent of the original div
                                originalDiv.parentNode.appendChild(clonedDiv);

                            }
                        }
                    break innerLoop;
                }
            }
        }
        
    }
}

export const getServiceOpportunities = async function() {
    // NEW LOOP AURA
     if (true) {
        sessionStorage.setItem("filterBySignedUp", "true");
        
    } else {
        sessionStorage.removeItem("filterBySignedUp");
        window.location.reload();
    };
    const logsRef = collection(db, "studentServiceLog");
    const originalDiv = document.getElementById('opportunity1');
    originalDiv.style.display = 'none';
    //FIREBASE ISSUE
    const q = query(collection(db, "serviceOpportunities"), orderBy("opportunityDate", "desc"));
    const querySnapshot = await getDocs(q);
    for (const docSnap of querySnapshot.docs) {
        if (docSnap.exists()) {
            const data = docSnap.data();

            // check if oppertunity is old
            const timestamp = new Date(`${data.opportunityDate}T${data.opportunityTime}`);
            const currentDate = new Date();
            const timestampDate = new Date(timestamp);
            const currentDateTimeInMs = currentDate.getTime();
            const timestampDateTimeInMs = timestampDate.getTime();
            console.log("currentDateTimeInMs: " + currentDateTimeInMs);
            console.log("timestampDateTimeInMs: " + timestampDateTimeInMs);
            const differenceTimeInMs = currentDateTimeInMs - timestampDateTimeInMs;
            const isPast = differenceTimeInMs > 0 && differenceTimeInMs > 1210000000;

            // delete if past 14 days
            if (isPast) {
                console.log("MUST DELETE: " + data.opportunityName);
                await deleteDoc(doc(db, "serviceOpportunities", docSnap.id));
                window.location.reload();
                continue;
            }

            if (sessionStorage.getItem("filterBySignedUp") === "true") {
                const user = await getCurrentUser();
                if (!data.signedUpUsers || !data.signedUpUsers.includes(user.uid)) {
                    continue;
                }
            }

            // do some div cloning
            const clonedDiv = originalDiv.cloneNode(true);
            clonedDiv.style.display = 'block';
            clonedDiv.style.backgroundColor = "rgb(141,13,24)";
            clonedDiv.style.color = "rgb(243, 232, 234)";
            clonedDiv.style.padding = " 15px 15px";
            clonedDiv.style.borderRadius = "15px";
            clonedDiv.style.marginBottom = "15px";
            clonedDiv.style.width = "85%";

            const id = docSnap.id;
            clonedDiv.id = `opportunity${id}`;
            clonedDiv.querySelector('#opportunityName').id = `opportunityName${id}`;
            clonedDiv.querySelector('#opportunityDescription').id = `opportunityDescription${id}`;
            clonedDiv.querySelector('#opportunityLength').id = `opportunityLength${id}`;
            clonedDiv.querySelector('#opportunityDate').id = `opportunityDate${id}`;
            clonedDiv.querySelector('#opportunityTime').id = `opportunityTime${id}`;
            clonedDiv.querySelector('#opportunityLocation').id = `opportunityLocation${id}`;
            const button = clonedDiv.querySelector('#opportunityButton');
            button.id = `opportunityButton${id}`;

            // Update text content of the cloned elements
            clonedDiv.querySelector(`#opportunityName${id}`).textContent = "Name: " + data.opportunityName;
            clonedDiv.querySelector(`#opportunityDescription${id}`).textContent = "Description: " + data.opportunityDescription;
            clonedDiv.querySelector(`#opportunityLength${id}`).textContent = "Length: " + data.opportunityLength;
            clonedDiv.querySelector(`#opportunityDate${id}`).textContent = "Date: " + data.opportunityDate;
            clonedDiv.querySelector(`#opportunityTime${id}`).textContent = "Time: " + data.opportunityTime;
            clonedDiv.querySelector(`#opportunityLocation${id}`).textContent = "Location: " + data.opportunityLocation;
            button.textContent = "View Service Opportunity";

            // edit some aperiodic if the user is an admin because they should not be able t osign up for service oppertunites
            const isAdmin = await checkAdminStatus();
            if (isAdmin) {
                const checkMarkLabel = document.getElementById("checkMarkLabel");
                const checkMarkBox = document.getElementById("myCheck");
                const checkMarkBreak = document.getElementById("checkMarkBreak");
                checkMarkLabel.style.display = "none";
                checkMarkBox.style.display = "none";
                checkMarkBreak.style.display = "block";

                // button.style.display = "none";
                button.innerText = "Edit Service Opportunity";
                button.onclick = () => {
                    sessionStorage.setItem("opportunityIDToEdit", id);
                    window.location.href = "./serviceEditOpportunity.html";
                };
            } else {
                button.onclick = () => {
                    sessionStorage.setItem("opportunityName", data.opportunityName);
                    window.location.href = "./serviceViewOpportunity.html";
                };
            }

            // Append the cloned div to the parent of the original div
            originalDiv.parentNode.appendChild(clonedDiv);
        }
    }
}

// checkbox JavaScript to filter by signed up service opportunities



   