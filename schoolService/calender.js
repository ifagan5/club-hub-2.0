import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, getDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, Timestamp} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: "AIzaSyDKBBs0TWerQno_u8yjNqV5qmvQImf6xA0",
    authDomain: "club-hub-2.firebaseapp.com",
    projectId: "club-hub-2",
    storageBucket: "club-hub-2.firebasestorage.app",
    messagingSenderId: "339870020143",
    appId: "1:339870020143:web:cc698c287ed642e3798cda",
    measurementId: "G-P97ML6ZP15"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth(app);
s

async function createMeeting(id) {
    console.log("Create opportunity called!");
  
    // Inputs
    const meetingDate = document.getElementById("meeting-date").value;   // YYYY-MM-DD
    const meetingTime = document.getElementById("meeting-time").value;   // HH:MM
    const meetingDesc = document.getElementById("meeting-desc").value;
    const meetingLocation = document.getElementById("meeting-location").value;
    const isAnEvent = document.querySelector('input[name="event"]:checked')?.value === "yes";
    const isLeadersOnly = document.getElementById("leaders-only")?.checked === true;
    const isGod = localStorage.getItem("isGod") === "true";
    const isLeader = localStorage.getItem("isLeader") === "true";
    const recurring = document.getElementById("recurring")?.checked === true;
  
    if (!meetingDate || !meetingTime || !meetingDesc || !meetingLocation) {
      alert("Please fill in all fields!");
      return;
    }
  
    // Helpers (scoped here to avoid changing imports/Globals)
    const atLocalTime = (dateOnly, timeHHmm) => {
      const [y, m, d] = dateOnly.split("-").map(Number);
      const [hh, mm] = timeHHmm.split(":").map(Number);
      return new Date(y, m - 1, d, hh, mm, 0, 0);
    };
    const addDays = (dt, n) => {
      const d = new Date(dt.getTime());
      d.setDate(d.getDate() + n);
      return d;
    };
    const addMonthsPreserveDate = (dt, n) => {
      const d = new Date(dt.getTime());
      d.setMonth(d.getMonth() + n);
      return d;
    };
  
    const firstDateTime = atLocalTime(meetingDate, meetingTime);
  
    const overlappingMeetingsCount = await getNearbyMeetingsCount(firstDateTime, id);
    if (overlappingMeetingsCount >= 3) {
      const formattedDate = firstDateTime.toLocaleDateString();
      const formattedTime = firstDateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const proceed = confirm(`There are currently ${overlappingMeetingsCount} meetings by other clubs within ±2 hours of ${formattedTime} on ${formattedDate}. Do you still want to add this meeting?`);
      if (!proceed) {
        console.log("Meeting creation canceled due to nearby meeting density.");
        return;
      }
    }
  
    // Build list of occurrence Date objects (always include the first)
    let occurrences = [firstDateTime];
  
    if (recurring) {
      const freq = document.getElementById("frequency").value; // "weekly"|"biweekly"|"monthly"
      const endType = document.querySelector('input[name="end-type"]:checked')?.value || "count";
  
      if (endType === "count") {
        // Number of repetitions (including the first one already added)
        let reps = parseInt(document.getElementById("repetitions").value || "1", 10);
        if (isNaN(reps) || reps < 1) reps = 1;
  
        if (freq === "weekly" || freq === "biweekly") {
          const step = (freq === "biweekly") ? 14 : 7;
          let cur = new Date(firstDateTime.getTime());
          for (let i = 1; i < reps; i++) {
            cur = addDays(cur, step);
            occurrences.push(new Date(cur.getTime()));
          }
        } else { // monthly
          let cur = new Date(firstDateTime.getTime());
          for (let i = 1; i < reps; i++) {
            cur = addMonthsPreserveDate(cur, 1);
            occurrences.push(new Date(cur.getTime()));
          }
        }
      } else {
        // End by date (inclusive)
        const untilRaw = document.getElementById("end-date").value;
        if (!untilRaw) {
          alert("Please choose an end date for the recurrence.");
          return;
        }
        const [uy, um, ud] = untilRaw.split("-").map(Number);
        const until = new Date(uy, um - 1, ud, 23, 59, 59, 999);
  
        if (freq === "weekly" || freq === "biweekly") {
          const step = (freq === "biweekly") ? 14 : 7;
          let cur = addDays(firstDateTime, step);
          while (cur <= until) {
            occurrences.push(new Date(cur.getTime()));
            cur = addDays(cur, step);
          }
        } else { // monthly
          let cur = addMonthsPreserveDate(firstDateTime, 1);
          while (cur <= until) {
            occurrences.push(new Date(cur.getTime()));
            cur = addMonthsPreserveDate(cur, 1);
          }
        }
      }
    }
  
    // Write each occurrence as an unrelated meeting doc (no new fields added)
    const clubDocRef = doc(db, "clubs", id);
    const meetingsCollectionRef = collection(clubDocRef, "all-meetings");
  
    for (const when of occurrences) {
      const meetingTimestamp = Timestamp.fromDate(when);
      const newMeetingRef = doc(meetingsCollectionRef); // Auto ID
      await setDoc(newMeetingRef, {
        attendance: 0,
        description: meetingDesc,
        location: meetingLocation,
        date: meetingTimestamp,
        isAnEvent: isAnEvent,
        privateMeeting: !!isLeadersOnly
      });
    }
  
    console.log(`Saved ${occurrences.length} meeting(s).`);
    location.reload();
  }