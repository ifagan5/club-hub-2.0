import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {checkAdminStatus} from "./serviceAuth.js";
import { getFirestore, arrayUnion, getCountFromServer, collection, collectionGroup, addDoc, getDocs,getDoc, doc, updateDoc, deleteDoc, setDoc, Timestamp, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {checkLoginStatus, getCurrentUser} from "./serviceAuth.js";

const isAdmin = await checkAdminStatus()
console.log("User admin: "  + isAdmin)
if (isAdmin === false) {
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
const docsRef = collection(db, "students");

const input = document.getElementById("searchInput");
const studentName = document.getElementById("adminStudentName");
const studentGrade = document.getElementById("adminStudentGrade");
const studentNonSchoolHours = document.getElementById("adminStudentNonSchoolHours");
const studentSchoolHours = document.getElementById("adminStudentSchoolHours");
const bigName = document.getElementById("adminBigStudentName");
let selectedStudentUID = null;


input.addEventListener("keydown", async function (event) {
  // Check if the pressed key is "Enter"
  if (event.key === "Enter") {
    let inputVal = input.value;
    console.log("This worked!")

    // Helper to normalize case (e.g., "jake" -> "Jake")
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    // Split the input into first name and last name using spaces
    const [firstName, ...lastNameParts] = inputVal.split(" ");
    const lastName = lastNameParts.map(capitalize).join(" ");
    const formattedFirstName = capitalize(firstName);

    // Make the query and filter by the first and the last name
    const q = query(docsRef, where("firstName", "==", formattedFirstName), where("lastName", "==", lastName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // check for students with first name
      const q2 = query(docsRef, where("firstName", "==", formattedFirstName));
      const querySnapshot2 = await getDocs(q2);
      if (!querySnapshot2.empty) {
        alert("WARNING: No exact match was found! Initializing first name fallback search. You may be prompted multiple more times. Click cancel on the alerts until you see the student you are looking for.")
        querySnapshot2.forEach((doc) => {
          const data = doc.data();
          const studentId = doc.id;
          const fullName = `${data.firstName} ${data.lastName}`;
          const schoolHours = data.totalSchoolHours || 0;
          const totalHours = data.totalNonSchoolHours || 0;
          const grade = data.gradYr || "N/A";
          let schoolRequirement = null;
          const isAdmin = data.admin;
          if (isAdmin === true) {
            return;
          }

          if (grade === "2027"){
              schoolRequirement = "(10 service to the school hours before senior year to graduate)"
          }
          else if (grade === "2028"){
              schoolRequirement = "(20 service to the school hours before senior year to graduate)"
          }
          else {
              schoolRequirement = "(30 service to the school hours before senior year to graduate)"
          }

          let communityRequirement;
          if (grade === "2027"){
              communityRequirement =  "(30 general community service hours before senior year to graduate)"
          }
          else if (grade === "2028"){
              communityRequirement = "(15 general community service hours before senior year to graduate)"
          }
          else {
              communityRequirement = "(No general community service graduation requirement)"
          }
                    console.log("Found student ID:", studentId);
          console.log("Name:", fullName, "Grade:", grade, "School Hours:", schoolHours, "Total Hours:", totalHours);

          if (window.confirm("Would would like to view this students information: " + fullName + "? (ok = yes, cancel = no)")) {
            studentName.innerHTML = fullName;
            bigName.innerHTML = fullName;
            studentGrade.innerHTML = grade;
            studentNonSchoolHours.innerHTML = totalHours + " " + communityRequirement;
            studentSchoolHours.innerHTML = schoolHours + " " + schoolRequirement;
            selectedStudentUID = doc.id;
            sessionStorage.setItem("studentUID", doc.id);
          }
        });
      } else {
        alert("No student found with that exact name or first name. Try again!")
      }
    } else {
      querySnapshot.forEach((doc) => {
        // TODO: add a student grade element
        //const savedUID = sessionStorage.setItem("studentUID", doc.id);
        const data = doc.data();
        const studentId = doc.id;
        const fullName = `${data.firstName} ${data.lastName}`;
        const schoolHours = data.totalSchoolHours || 0;
        const totalHours = data.totalHours || 0;
        const grade = data.gradYr || "N/A";
        const isAdmin = data.admin;

        if (isAdmin === true) {
          return;
        }

        console.log("Found student ID:", studentId);
        console.log("Name:", fullName, "Grade:", grade, "School Hours:", schoolHours, "Total Hours:", totalHours);

        if (window.confirm("Would would like to view this students information: " + fullName)) {
          studentName.innerHTML = fullName;
          bigName.innerHTML = fullName;
          studentGrade.innerHTML = grade;
          studentNonSchoolHours.innerHTML = totalHours + " " + communityRequirement;
          studentSchoolHours.innerHTML = schoolHours + " " + schoolRequirement;
          selectedStudentUID = doc.id;
          sessionStorage.setItem("studentUID", doc.id);

        }
      });
    }
  }
});

export const getLogActivity = async function() {
    const uid = sessionStorage.getItem("studentUID");
    console.log("savedUID = " + uid);
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
                                document.getElementById("logged-hours").innerText = "Total Hours Logged: " + hours;
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
                                clonedDiv.querySelector(`#logged-hours${i + 1}`).innerText = "Total Hours Logged: " + hours;
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