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

    //deleting the logs from the last page
    for(let i = 1; i <10000; i++){
        console.log("line 40");
        if(document.getElementById(`log${i}`)){
            const element = document.getElementById(`log${i}`);
            if (i > 1) {
                element.remove();
            }
        }
        else{
            console.log("line 45");
            break;
        }
    }

    const button = document.getElementById("logButton2");
    //button.outerHTML = '<button class="loginButton2" id="logButton2" onClick = "getServiceOpportunitiesReal();">View Your Sign Ups</button>';

    const name = document.getElementById("logHistoryName");
    name.outerHTML = '<header class="subheading" id="logHistoryName">Your Log History</header>';
    
    const user = await getCurrentUser()
    const uid = user.uid;
    console.log(uid);
    const logsRef = collection(db, "studentServiceLog", uid, "logs");
    const q = query(logsRef, orderBy("logNum", "desc"));
    const querySnapshot = await getDocs(q);

    let count = 1;
    querySnapshot.forEach((docSnap) => {
        let contact = docSnap.data().contact;
        let date = docSnap.data().date;
        let description = docSnap.data().description;
        let hours;
        let type;
        if(docSnap.data().hours == 0){
            hours = docSnap.data().schoolServiceHours;
            type = "School Service";
        }
        else{
            hours = docSnap.data().hours;
            type = "General Service";
        }

        const originalDiv = document.getElementById('log1');
        originalDiv.style.backgroundColor = "rgb(141,13,24)";
        originalDiv.style.color = "rgb(243, 232, 234)";
        originalDiv.style.padding = " 15px 15px";
        originalDiv.style.borderRadius = "15px";
        originalDiv.style.marginBottom = "15px";
        originalDiv.style.width = "85%";

        if (count === 1) {
            document.getElementById("activity").innerText = "Activity: " + description;
            document.getElementById("logged-hours").innerText = "Hours: " + hours;
            document.getElementById("logged-hours-to-school").innerText = "Type of Service: " + type;
            document.getElementById("date").innerText = "Date Completed: " + date;
            document.getElementById("contact").innerText = "Contact Person: " + contact;
        } else {
            const clonedDiv = originalDiv.cloneNode(true);
            clonedDiv.id = `log${count}`; 
            clonedDiv.querySelector('#activity').id = `activity${count}`;
            clonedDiv.querySelector('#logged-hours').id = `logged-hours${count}`;
            clonedDiv.querySelector('#logged-hours-to-school').id = `logged-hours-to-school${count}`;
            clonedDiv.querySelector('#date').id = `date${count}`;
            clonedDiv.querySelector('#contact').id = `contact${count}`;

            clonedDiv.querySelector(`#activity${count}`).innerText = "Activity: " + description;
            clonedDiv.querySelector(`#logged-hours${count}`).innerText = "Hours: " + hours;
            clonedDiv.querySelector(`#logged-hours-to-school${count}`).innerText = "Type of Service: " + type;
            clonedDiv.querySelector(`#date${count}`).innerText = "Date Completed: " + date;
            clonedDiv.querySelector(`#contact${count}`).innerText = "Contact Person: " + contact;

            originalDiv.parentNode.appendChild(clonedDiv);
        }
        count++;
    });
}


/* getServiceOpportunities()
prints out each opportunity the student has sign up for in order from most to least recent.
Each opportunity prints out in a box with the format:
Name: 
Description:
Length: 
Date: 
Time: 
Location: 
Includes button that lets students claim hours once passed or view before completing. 
Automatically deletes opporunities once passed
*/
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
             const canClaim = currentDateTimeInMs > timestampDateTimeInMs;
            const isPast = differenceTimeInMs > 0 && differenceTimeInMs > 1210000000;
            const button = document.getElementById("opportunityButtonYay");;
            button.id = `opportunityButtonYay`;

            // delete if past 14 days
            
             if (canClaim) {
                        // code to claim service hours
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
            
                                    const serviceLogCollectionRef = collection(db, "studentServiceLog", uid, "logs");
                                    const countSnap = await getCountFromServer(serviceLogCollectionRef);
                                    const i = countSnap.data().count;
                                    const logEntry = {
                                        //uid: [`log${snapshot.data().count}`],
                                        logNum: i+1,
                                        hours: 0,
                                        schoolServiceHours: data.opportunityLength,
                                        description: data.opportunityDescription,
                                        contact: data.opportunityContact || "Service Opportunity",
                                        date: data.opportunityDate,
                                        timestamp: Timestamp.now(), // Add a server-side timestamp
                                    };
            
                                    await addDoc(serviceLogCollectionRef, logEntry);
            
                                    alert("Your new total service to the school hours: " +newHours + " hours");
                                    await updateDoc(studentDocRef, {
                                        totalSchoolHours: newHours,
                                    });
            
                                }
                                window.location.reload()
                            });}
            if (isPast) {
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
            const button2 = clonedDiv.querySelector('#opportunityButtonYay');
            button2.id = `opportunityButtonYay${id}`;

            // Update text content of the cloned elements
            clonedDiv.querySelector(`#opportunityName${id}`).textContent = "Name: " + data.opportunityName;
            clonedDiv.querySelector(`#opportunityDescription${id}`).textContent = "Description: " + data.opportunityDescription;
            clonedDiv.querySelector(`#opportunityLength${id}`).textContent = "Length: " + data.opportunityLength;
            clonedDiv.querySelector(`#opportunityDate${id}`).textContent = "Date: " + data.opportunityDate;
            clonedDiv.querySelector(`#opportunityTime${id}`).textContent = "Time: " + data.opportunityTime;
            clonedDiv.querySelector(`#opportunityLocation${id}`).textContent = "Location: " + data.opportunityLocation;
            button2.textContent = "View Service Opportunity";

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
                button2.innerText = "Edit Service Opportunity";
                button2.onclick = () => {
                    sessionStorage.setItem("opportunityIDToEdit", id);
                    window.location.href = "./serviceEditOpportunity.html";
                };
            } else {
                button2.onclick = () => {
                    sessionStorage.setItem("opportunityName", data.opportunityName);
                    window.location.href = "./serviceViewOpportunity.html";
                };
            }

            // Append the cloned div to the parent of the original div
            originalDiv.parentNode.appendChild(clonedDiv);
        }
    }
}

/*
export const claimHours = async function() {
    //claiming hours taken from an old function
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
    
                            const serviceLogCollectionRef = collection(db, "studentServiceLog", uid, "logs");
                            const countSnap = await getCountFromServer(serviceLogCollectionRef);
                            const i = countSnap.data().count;
                            const logEntry = {
                                //uid: [`log${snapshot.data().count}`],
                                logNum: i+1,
                                hours: 0,
                                schoolServiceHours: h,
                                description: oppDesc,
                                contact: oppCon,
                                date: oppDate,
                                timestamp: Timestamp.now(), // Add a server-side timestamp
                            };
    
                            await addDoc(serviceLogCollectionRef, logEntry);
    
                            alert("Your new total service to the school hours: " +newHours + " hours");
                            await updateDoc(studentDocRef, {
                                totalSchoolHours: newHours,
                            });
                            const button = document.getElementById("opportunityButtonYay");
                            button.outerHTML = '<button id="opportunityButtonYay" class="loginButton2 clubLB">Hours Claimed</button>';

                        }
    
}}

*/