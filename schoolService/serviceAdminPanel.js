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

/*
event listener
Triggered when the user presses the "enter" button
Searches for student(s) using the user's input.
- If there is no input it alerts the user
- If the input is not the same as any first or last name of a student it alerts the user
- If the input is the same as a student(s) first or last name it displays the student's information on the screen and
    saves an array of the student's uid(s) in session storage with the key "studentUIDArray"
*/

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
    //if there is not student with the exact first and last name (or only entered one name...)
    if (querySnapshot.empty) {
      // check for students with the searched first or last name and add each student to the query q2
      const q2 = query(
          collection(db, "students"),
          or(
            where("firstName", "==", formattedFirstName),
            where("lastName", "==", formattedFirstName)
          )
        );
      let docIds = [];
      const querySnapshot2 = await getDocs(q2);
      //if there is not student with that name (snapshot is empty) make an alert for the admin
    if (querySnapshot2.empty) {
        alert("No student found with that first or last name. Try again!")
      }

  //if there is at least one student with that first or last name (querySnapshot2 is not empty) push each student's id
  //to an array called docIds
    if(!querySnapshot2.empty){
      querySnapshot2.forEach((doc) => {
      docIds.push(doc.id);
      console.log(docIds);
    });

//get how many students there are by getting the count of the array
    const countSnap = await getCountFromServer(q2);
    const countLogs = countSnap.data().count;
    console.log("countLogs:" + countLogs);
    //set the array in session storage with the key studentUIDArray and set that to a const called saved in the function
    sessionStorage.setItem("studentUIDArray", docIds);
    const saved = sessionStorage.getItem("studentUIDArray");
    console.log("sessionStorage " + saved);

    //making a for loop that goes through the array
    for (let i = countLogs; i >= 1; i--) {
      //get the id of the first student in the array and get the whole document of the student using their uid
      let tempDocumentUID = docIds[i-1];
      let tempDocRef = doc(db, "students", tempDocumentUID);
      let tempDocSnap = await getDoc(tempDocRef);
      if (tempDocSnap.exists()) {
        //getting all the info for the student
        const studentId = tempDocSnap.data().uid;
        const fullName = `${tempDocSnap.data().firstName} ${tempDocSnap.data().lastName}`;
        const schoolHours = tempDocSnap.data().totalSchoolHours || 0;
        const totalHours = tempDocSnap.data().totalNonSchoolHours || 0;
        const grade = tempDocSnap.data().gradYr || "N/A";
        let schoolRequirement = null;
        const isAdmin = tempDocSnap.data().admin;
        //if the student I'm looking at is an admin just return (they don't have community service requirements) and move on
        if (isAdmin === true) {
            return;
          }
        //getting what the student's different requirments are based on their graduation year
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
        
        //if this is the first student edit the original divs
        const originalDiv = document.getElementById('studentWrapper');
        if (i===countLogs){
          console.log(i + " first iteration");
          document.getElementById("adminStudentName").innerHTML = fullName;
          document.getElementById("adminStudentGrade").innerHTML = grade;
          document.getElementById("adminStudentNonSchoolHours").innerHTML = totalHours + " " + communityRequirement;
          document.getElementById("adminStudentSchoolHours").innerHTML = schoolHours + " " + schoolRequirement;
          document.getElementById("adminBigStudentName").innerHTML = fullName;
          document.getElementById("adminViewLog").innerHTML = fullName + "'s Log";
          selectedStudentUID = doc.id;
          //sessionStorage.setItem("studentUID", doc.id);
        }
        //if it is not the first student make a clondedDiv and edit that and append it to the original
        else{
          console.log(i + " next iteration");
          const clonedDiv = originalDiv.cloneNode(true);
          clonedDiv.id = `log${i}`; // Update ID for uniqueness
          clonedDiv.querySelector('#adminStudentName').id = `adminStudentName${i}`;
          clonedDiv.querySelector('#adminStudentGrade').id = `adminStudentGrade${i}`;
          clonedDiv.querySelector('#adminStudentNonSchoolHours').id = `adminStudentNonSchoolHours${i}`;
          clonedDiv.querySelector('#adminStudentSchoolHours').id = `adminStudentSchoolHours${i}`;
          clonedDiv.querySelector('#adminBigStudentName').id = `adminBigStudentName${i}`;
          clonedDiv.querySelector('#adminViewLog').id = `adminViewLog${i}`;
          // Update text content of the cloned elements
          clonedDiv.querySelector(`#adminStudentName${i}`).innerHTML = fullName;
          clonedDiv.querySelector(`#adminStudentGrade${i}`).innerHTML = grade;
          clonedDiv.querySelector(`#adminStudentNonSchoolHours${i}`).innerHTML = totalHours + " " + communityRequirement;
          clonedDiv.querySelector(`#adminStudentSchoolHours${i}`).innerHTML = schoolHours + " " + schoolRequirement;
          clonedDiv.querySelector(`#adminBigStudentName${i}`).innerHTML = fullName;
          clonedDiv.querySelector(`#adminViewLog${i}`).innerHTML = fullName + "'s Log";

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

/*
getElementId()
Is called when the user presses on the "view student's log" button
Gets the id of the button and uses it to figure out what uid in the session storage array it is connected to, gets
the student's uid from studentUIDArray in session stoarge and saves it to session storage with the key "studentUID"
before replacing the location with adminStudentHistory.html.
*/
export const getElementId = async function(obj){
  console.log("getElementId called");
    //get button's ID
    const buttonId = obj.id;
    console.log("Button ID: " + buttonId);
    //gets the number from the ID
    const num = buttonId.substring(12);
    console.log("num = " + num);
    //gets the array of students from session storage and translates it from a string into an array
    const docIDS = sessionStorage.getItem("studentUIDArray");
    const docIds = docIDS.split(",");
    //if the first interation there is no number at the end of the id so num does not exist
    if (!num){
      //get the students ID based on which number button was pressed and what number the student is in the array
      const count = docIds.length;
      console.log("count = " + count);
      let tempDocumentUID = docIds[count -1];
      let tempDocRef = doc(db, "students", tempDocumentUID);
      let tempDocSnap = await getDoc(tempDocRef);
      if (tempDocSnap.exists()) {
        //getting all the info for each student and setting the student's uid in session storage
        //let data = doc.data();
        const studentId = tempDocSnap.data().uid;
        sessionStorage.setItem("studentUID", studentId);

      }
    }
    //for other iterations get the number at the end of the button and do same thing
    else{
      let tempDocumentUID = docIds[num -1 ];
      console.log("tempDocumentUID = " + tempDocumentUID);
      let tempDocRef = doc(db, "students", tempDocumentUID);
      let tempDocSnap = await getDoc(tempDocRef);
      if (tempDocSnap.exists()) {
        //getting all the info for each student
        //let data = doc.data();
        const studentId = tempDocSnap.data().uid;
        //
        sessionStorage.setItem("studentUID", studentId);
        console.log("studentId = " + studentId);
      }

    }
    //replace the location with adminStudentHistory.html
    location.replace('adminStudentHistory.html');
}