import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {checkAdminStatus} from "./serviceAuth.js";
import { getFirestore, arrayUnion, getCountFromServer, collection, collectionGroup, addDoc, getDocs,or, getDoc, doc, updateDoc, deleteDoc, setDoc, Timestamp, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
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
    const formattedLastName = lastNameParts.map(capitalize).join(" ");
    const formattedFirstName = capitalize(firstName);

    // Make the query and filter by the first and the last name
    const q = query(docsRef, where("firstName", "==", formattedFirstName), where("lastName", "==", formattedLastName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // check for students with first name
      //const q2 = query(docsRef, where("firstName", "==", formattedFirstName));
      const q2 = query(
          collection(db, "students"),
          or(
            where("firstName", "==", formattedFirstName),
            where("lastName", "==", formattedFirstName)
          )
        );
      let docIds = [];
      const querySnapshot2 = await getDocs(q2);
    if (querySnapshot2.empty) {
        alert("No student found with that first or last name. Try again!")
      }
  
    if(!querySnapshot2.empty){
      querySnapshot2.forEach((doc) => {
      docIds.push(doc.id);
      console.log(docIds);
    });

    const countSnap = await getCountFromServer(q2);
    const countLogs = countSnap.data().count;
    console.log("countLogs:" + countLogs);
    sessionStorage.setItem("studentUIDArray", docIds);
    const saved = sessionStorage.getItem("studentUIDArray");
    console.log("sessionStorage " + saved);

    for (let i = countLogs; i >= 1; i--) {
      let tempDocumentUID = docIds[i-1];
      let tempDocRef = doc(db, "students", tempDocumentUID);
      let tempDocSnap = await getDoc(tempDocRef);
      if (tempDocSnap.exists()) {
        //getting all the info for each student
        //let data = doc.data();
        const studentId = tempDocSnap.data().uid;
        const fullName = `${tempDocSnap.data().firstName} ${tempDocSnap.data().lastName}`;
        const schoolHours = tempDocSnap.data().totalSchoolHours || 0;
        const totalHours = tempDocSnap.data().totalNonSchoolHours || 0;
        const grade = tempDocSnap.data().gradYr || "N/A";
        let schoolRequirement = null;
        const isAdmin = tempDocSnap.data().admin;
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
        
        
        const originalDiv = document.getElementById('studentWrapper');
        if (i===countLogs){
          document.getElementById("adminStudentName").innerHTML = fullName;
          document.getElementById("adminStudentGrade").innerHTML = grade;
          document.getElementById("adminStudentNonSchoolHours").innerHTML = totalHours + " " + communityRequirement;
          document.getElementById("adminStudentSchoolHours").innerHTML = schoolHours + " " + schoolRequirement;
          document.getElementById("adminBigStudentName").innerHTML = fullName;
          document.getElementById("adminViewLog").innerHTML = fullName + "'s Log";
          selectedStudentUID = doc.id;
          //sessionStorage.setItem("studentUID", doc.id);
        }
        else{
          const clonedDiv = originalDiv.cloneNode(true);
          clonedDiv.id = `log${i + 1}`; // Update ID for uniqueness
          clonedDiv.querySelector('#adminStudentName').id = `adminStudentName${i + 1}`;
          clonedDiv.querySelector('#adminStudentGrade').id = `adminStudentGrade${i + 1}`;
          clonedDiv.querySelector('#adminStudentNonSchoolHours').id = `adminStudentNonSchoolHours${i + 1}`;
          clonedDiv.querySelector('#adminStudentSchoolHours').id = `adminStudentSchoolHours${i + 1}`;
          clonedDiv.querySelector('#adminBigStudentName').id = `adminBigStudentName${i + 1}`;
          clonedDiv.querySelector('#adminViewLog').id = `adminViewLog${i + 1}`;
          // Update text content of the cloned elements
          clonedDiv.querySelector(`#adminStudentName${i + 1}`).innerHTML = fullName;
          clonedDiv.querySelector(`#adminStudentGrade${i + 1}`).innerHTML = grade;
          clonedDiv.querySelector(`#adminStudentNonSchoolHours${i + 1}`).innerHTML = totalHours + " " + communityRequirement;
          clonedDiv.querySelector(`#adminStudentSchoolHours${i + 1}`).innerHTML = schoolHours + " " + schoolRequirement;
          clonedDiv.querySelector(`#adminBigStudentName${i + 1}`).innerHTML = fullName;
          clonedDiv.querySelector(`#adminViewLog${i + 1}`).innerHTML = fullName + "'s Log";

          // Append the cloned div to the parent of the original div
          originalDiv.parentNode.appendChild(clonedDiv);
          selectedStudentUID = doc.id;
          //Storage.setItem("studentUID", doc.id);
        }



      }
      
    }
    }
  }
}})



export const buttonClick = async function(){

}