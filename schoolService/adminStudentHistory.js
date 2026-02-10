import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, getDoc, doc, getCountFromServer } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = { /* same config */ };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getLogActivity = async function () {
  const uid = sessionStorage.getItem("studentUID");
  console.log("savedUID =", uid);

  if (!uid) {
    alert("No student selected.");
    return;
  }

  const logsRef = collection(db, "studentServiceLog", uid, "logs");
  const countSnap = await getCountFromServer(logsRef);
  const countLogs = countSnap.data().count;

  console.log("countLogs:", countLogs);

  if (countLogs === 0) return;

  const querySnapshot = await getDocs(logsRef);
  const docIds = [];
  querySnapshot.forEach(doc => docIds.push(doc.id));

  
};
