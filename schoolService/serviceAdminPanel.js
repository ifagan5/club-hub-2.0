import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, getDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, Timestamp, query, where} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import {checkAdminStatus} from "./serviceAuth.js";


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


input.addEventListener("keydown", async function (event) {
  // Check if the pressed key is "Enter"
  if (event.key === "Enter") {
    let inputVal = input.value;
    console.log("This worked!")

    // Split the input into first name and last name using spaces
    const [firstName, ...lastNameParts] = inputVal.split(" ");
    const lastName = lastNameParts.join(" ");

    // Make the query and filter by the first and the last name
    const q = query(docsRef, where("firstName", "==", firstName), where("lastName", "==", lastName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // check for students with first name
      const q2 = query(docsRef, where("firstName", "==", inputVal));
      const querySnapshot2 = await getDocs(q2);
      if (!querySnapshot2.empty) {
        alert("WARNING: No exact match was found! Initializing first name fallback search. You may be prompted multiple more times. Click cancel on the alerts until you see the student you are looking for.")
        querySnapshot2.forEach((doc) => {
          const data = doc.data();
          const studentId = doc.id;
          const fullName = `${data.firstName} ${data.lastName}`;
          const schoolHours = data.totalSchoolHours || 0;
          const totalHours = data.totalHours || 0;
          const grade = data.grade || "N/A";

          console.log("Found student ID:", studentId);
          console.log("Name:", fullName, "Grade:", grade, "School Hours:", schoolHours, "Total Hours:", totalHours);

          if (window.confirm("Would would like to view this students information: " + fullName + "? (ok = yes, cancel = no)")) {
            studentName.innerHTML = fullName;
            studentGrade.innerHTML = grade;
            studentNonSchoolHours.innerHTML = totalHours;
            studentSchoolHours.innerHTML = schoolHours
          }
        });
      } else {
        alert("No student found with that exact name or first name. Try again!")
      }
    } else {
      querySnapshot.forEach((doc) => {
        // TODO: add a student grade element
        const data = doc.data();
        const studentId = doc.id;
        const fullName = `${data.firstName} ${data.lastName}`;
        const schoolHours = data.totalSchoolHours || 0;
        const totalHours = data.totalHours || 0;
        const grade = data.grade || "N/A";

        console.log("Found student ID:", studentId);
        console.log("Name:", fullName, "Grade:", grade, "School Hours:", schoolHours, "Total Hours:", totalHours);

        if (window.confirm("Would would like to view this students information: " + fullName)) {
          studentName.innerHTML = fullName;
          studentGrade.innerHTML = grade;
          studentNonSchoolHours.innerHTML = totalHours;
          studentSchoolHours.innerHTML = schoolHours
        }
      });
    }
  }
});














// export const createClubList = async function () {
//   studentList = []; // clear old list
//     const snapshot = await getDocs(collection(db, "students")); // Get all student docs
//     console.log("Total students in Firebase:", snapshot.size);
//
//     snapshot.forEach((docSnap) => {
//       const data = docSnap.data();
//       const firstName = data.firstName;
//       const lastName = data.lastName;
//
//       if (firstName && lastName) {
//         studentList.push({
//           uid: docSnap.id,
//           firstName: firstName,
//           lastName: lastName,
//         });
//       }
//     });
//
//     console.log("Loaded students into search:", studentList.length); // debug
// };
//
//
// // This class handles the instant search functionality (like a search bar that shows results as you type)
// class InstantSearch {
//   constructor(instantSearch, options) {
//     this.options = options;
//     this.elements = {
//       main: instantSearch, // Main container for the search
//       input: instantSearch.querySelector(".searchInput"), // The actual search input box
//       resultsContainer: document.createElement("div") // A div to hold the search results
//     };
//
//     // Style the results container and add it under the search input
//     this.elements.resultsContainer.classList.add("searchInput__resultsContainer");
//     this.elements.main.appendChild(this.elements.resultsContainer);
//     this.addListeners(); // Set up the event listeners (stuff like typing and focusing)
//   }
//
//   addListeners() {
//     let delay; // Used to create a little pause before running the search (so it’s not too fast)
//
//     this.elements.input.addEventListener("input", () => {
//       clearTimeout(delay); // Stop the previous timer if you're still typing
//       const query = this.elements.input.value; // Get what the user typed
//
//       // Wait 300ms before searching (like a tiny delay so we’re not searching every single keystroke)
//       delay = setTimeout(() => {
//         if (query.length < 1) {
//           this.populateResults([]); // If the search box is empty, show nothing
//           return;
//         }
//
//         // Search through the clubList and show the matching results
//         this.performSearch(query).then(results => {
//           this.populateResults(results);
//         });
//       }, 300);
//     });
//
//     // When the input is focused (clicked into), show the results box
//     this.elements.input.addEventListener("focus", () => {
//       this.elements.resultsContainer.classList.add("searchInput__results-container--visible");
//     });
//
//     // When you click away from the input, hide the results after a short delay
//     this.elements.input.addEventListener("blur", () => {
//       setTimeout(() => {
//         this.elements.resultsContainer.classList.remove("searchInput__results-container--visible");
//       }, 200);
//     });
//   }
//
//   // This puts the search results into the DOM
//   populateResults(results) {
//     this.elements.resultsContainer.innerHTML = ""; // Clear any old results
//
//     if (results.length === 0) {
//       // If nothing matches the search, show a "no results" message
//       const noResultDiv = document.createElement("div");
//       noResultDiv.classList.add("searchInput__no-results");
//       noResultDiv.textContent = "No students found.";
//       this.elements.resultsContainer.appendChild(noResultDiv);
//       return;
//     }
//
//     // If there are matches, add each one to the results container
//     for (const result of results) {
//       this.elements.resultsContainer.appendChild(this.createResultElement(result));
//     }
//   }
//
//   createResultElement(result) {
//     const anchor = document.createElement("a");
//     anchor.classList.add("searchInput__result");
//     anchor.innerHTML = this.options.templateFunction(result);
//
//     anchor.addEventListener("click", async (event) => {
//       event.preventDefault(); // Prevent default link behavior
//
//       // Save the student UID to session storage
//       sessionStorage.setItem('adminClub', result.uid);
//       // Call renderAdminClubInfo to populate the page
//       await renderAdminClubInfo();
//     });
//
//     return anchor;
//   }
//
//
//   // This function actually filters the studentList to find matches based on what was typed
//   performSearch(query) {
//     const lowerQuery = query.toLowerCase().trim();
//     if (!lowerQuery) {
//       return Promise.resolve([]);
//     }
//     const queryWords = lowerQuery.split(/\s+/).filter(word => word.length > 0);
//     const results = studentList.filter(student => {
//       const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
//       return queryWords.every(word => fullName.includes(word));
//     }).map(student => ({ name: `${student.firstName} ${student.lastName}`, uid: student.uid }));
//     return Promise.resolve(results);
//   }
// }
//
// // Run this after all the students are loaded from the database
// createClubList().then(() => {
//   const searchUsers = document.querySelector("#searchUsers"); // Find the search box in the HTML
//   if (searchUsers) {
//     // Start the InstantSearch on that element
//     new InstantSearch(searchUsers, {
//       templateFunction: result => `<div class="instant-search__title">${result.name}</div>` // Format for each result
//     });
//   }
// });
//
// export async function renderAdminClubInfo() {
//   var clubName = document.getElementById("adminClubName");
//   clubName.innerHTML = "";
//   var clubInfo = document.getElementById("adminaboutClub");
//
//   var adminClub = sessionStorage.getItem('adminClub');
//   if (adminClub) {
//     clubInfo.innerHTML = "";
//     const studentDocRef = doc(db, "students", adminClub);
//     const studentDoc = await getDoc(studentDocRef);
//
//     if (!studentDoc.exists()) {
//       clubName.innerHTML = "Student Not Found";
//       return;
//     }
//
//     const studentData = studentDoc.data();
//     // sets header to the student name
//     clubName.innerHTML = `${studentData.firstName || ""} ${studentData.lastName || ""}`;
//
//     function studentInfoField(container, labelText, value) {
//       const wrapper = document.createElement("div");
//       wrapper.className = "editable-field";
//
//       const label = document.createElement("strong");
//       label.textContent = labelText + ": ";
//       label.style.marginRight = "6px";
//
//       const valueSpan = document.createElement("span");
//       valueSpan.textContent = value ?? "N/A";
//
//       wrapper.appendChild(label);
//       wrapper.appendChild(valueSpan);
//       container.appendChild(wrapper);
//     }
//
//
//     function addInfoField(container, labelText, value) {
//       const wrapper = document.createElement("div");
//       wrapper.className = "editable-field";
//
//       const label = document.createElement("strong");
//       label.textContent = labelText + ": ";
//       label.style.marginRight = "6px";
//
//       const valueSpan = document.createElement("span");
//       valueSpan.textContent = value ?? "N/A";
//
//       wrapper.appendChild(label);
//       wrapper.appendChild(valueSpan);
//       container.appendChild(wrapper);
//     }
//
//
//     // Display student info
//     studentInfoField(clubInfo, "First Name", studentData.firstName);
//     studentInfoField(clubInfo, "Last Name", studentData.lastName);
//     studentInfoField(clubInfo, "Email", studentData.email);
//     addInfoField(clubInfo, "Total Hours", studentData.totalHours || 0);
//     addInfoField(clubInfo, "School Hours", studentData.totalSchoolHours || 0);
//   }
// }