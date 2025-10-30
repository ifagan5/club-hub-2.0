import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, getDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, Timestamp} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


export async function renderAdminClubInfo() {
    var clubName = document.getElementById("adminClubName");
    clubName.innerHTML = "";
    var clubInfo = document.getElementById("adminaboutClub");

    var adminClub = sessionStorage.getItem('adminClub');
    if (adminClub) {
        clubInfo.innerHTML = "";
        const parentDocRef = doc(db, "clubs", adminClub);
        const clubDoc = await getDoc(parentDocRef);

        // sets header to the club name
        clubName.innerHTML = clubDoc.data().clubName;

        // builds editable club fields
        const clubData = clubDoc.data();
    }
}