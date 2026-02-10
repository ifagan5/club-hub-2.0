import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, arrayUnion, getCountFromServer, collection, collectionGroup, addDoc, getDocs,getDoc, doc, updateDoc, deleteDoc, setDoc, Timestamp, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {checkLoginStatus, getCurrentUser} from "./serviceAuth.js";
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


export const getLogActivity = async function() {
    const user = await getCurrentUser()
    const uid = user.uid;
    console.log(uid);
    const logsRef = collection(db, "serviceOpportunities");
    const docSnap = await getDocs(logsRef);
    const docIds = [];
    const querySnapshot = await getDocs(collection(db, "serviceOpportunities"));
    querySnapshot.forEach((doc) => {
        docIds.push(doc.id);
    });
    //get how many logs the student has and save it as countLogs
    const serviceLogCollectionRef = collection(db, "serviceOpportunities");
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
                let tempDocRef = doc(db, "serviceOpportunities", tempDocumentUID);
                let tempDocSnap = await getDoc(tempDocRef);
                if (tempDocSnap.exists()) {
                    //get what log number this entry is
                    let possibleI = tempDocSnap.data().logNum;
                    //if it is the one we are looking for break the code
                    if (possibleI == i){
                        index = j;
                        //get the document at index j
                        let documentUID = docIds[index];
                        let docRef = doc(db, "studentServiceLog", documentUID);
                        let docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            let name = docSnap.data().opportunityName;
                            let description = docSnap.data().opportunityDescription;
                            let length = docSnap.data().opportunityLength;
                            let date = docSnap.data().opportunityDate;
                            let time = docSnap.data().opportunityTime;
                            let location = docSnap.data().opportunityLocation;

                            // Get the original elements from the HTML
                            const originalDiv = document.getElementById('opportunity1'); // Assuming 'log1' is the ID of the first log entry container
                            //STYLING
                            originalDiv.style.backgroundColor = "rgb(141,13,24)";
                            originalDiv.style.color = "rgb(243, 232, 234)";
                            originalDiv.style.padding = " 15px 15px";
                            originalDiv.style.borderRadius = "15px";
                            originalDiv.style.marginBottom = "15px";
                            originalDiv.style.width = "85%";

                            //for the most recent entry it prints out the information for that entry
                            if (i === countLogs) {
                                document.getElementById("opportunityName").innerText = "Name: " + name;
                                document.getElementById("opportunityDescription").innerText = "Description: " + description;
                                document.getElementById("opportunityLength").innerText = "Length: " + length;
                                document.getElementById("opportunityDate").innerText = "Date: " + date;
                                document.getElementById("opportunityTime").innerText = "Time: " + time;
                                document.getElementById("opportunityLocation").innerText = "Location: " + location;

                            } else {
                                // For subsequent log entries, clone the original elements and append them
                                const clonedDiv = originalDiv.cloneNode(true);
                                clonedDiv.id = `opportunity${i}`; // Update ID for uniqueness
                                clonedDiv.querySelector('#opportunityName').id = `opportunityName${i}`;
                                clonedDiv.querySelector('#opportunityDescription').id = `opportunityDescription${i}`;
                                clonedDiv.querySelector('#opportunityLength').id = `opportunityLength${i}`;
                                clonedDiv.querySelector('#opportunityDate').id = `opportunityDate${i}`;
                                clonedDiv.querySelector('#opportunityTime').id = `opportunityTime${i}`;
                                clonedDiv.querySelector('#opportunityLocation').id = `opportunityLocation${i}`;

                                // Update text content of the cloned elements
                                clonedDiv.querySelector(`#opportunityName${i}`).innerText = "Name: " + name;
                                clonedDiv.querySelector(`#opportunityDescription${i}`).innerText = "Description: " + description;
                                clonedDiv.querySelector(`#opportunityLength${i}`).innerText = "Length: " + length;
                                clonedDiv.querySelector(`#opportunityDate${i}`).innerText = "Date: " + date;
                                clonedDiv.querySelector(`#opportunityTime${i}`).innerText = "Time: " + time;
                                clonedDiv.querySelector(`#opportunityLocation${i}`).innerText = "Location: " + location;

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