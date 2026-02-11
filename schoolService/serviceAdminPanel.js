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
const buttonName = document.getElementById("adminViewLog");
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
        //alert("WARNING: No exact match was found! Initializing first name fallback search. You may be prompted multiple more times. Click cancel on the alerts until you see the student you are looking for.")
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

          //if (window.confirm("Would would like to view this students information: " + fullName + "? (ok = yes, cancel = no)")) {
            studentName.innerHTML = fullName;
            bigName.innerHTML = fullName;
            buttonName.innerHTML = fullName + "'s Log";
            studentGrade.innerHTML = grade;
            studentNonSchoolHours.innerHTML = totalHours + " " + communityRequirement;
            studentSchoolHours.innerHTML = schoolHours + " " + schoolRequirement;
            selectedStudentUID = doc.id;
            sessionStorage.setItem("studentUID", doc.id);
          //}
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
          buttonName.innerHTML = fullName + "'s Log";
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

