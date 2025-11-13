import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {getCookie} from "./serviceAuth.js";
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

export const logout = function () {
    console.log("Logout function called");
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log("User signed out successfully.");
        sessionStorage.clear();
        location.reload();
    }).catch((error) => {
        // An error happened.
        console.error("Error signing out:", error);
    });
}

export const getFirstName= async function(){
    const user = auth.currentUser;
    const firstName = user.firstName;
    return firstName
}

export const getLastName= async function(){
    const user = auth.currentUser;
    const lastName = user.lastName;
    return lastName
}

export const getEmail= async function(){
    try{
        console.log("works");
        const authCookie = getCookie("serviceStudentAuth")
        if(!user){
            alert("Please log in first");
        }
        const email = user.email;
        document.getElementById("student-Email").innerHTML = email;
    }
    catch (e){
        console.log("user not found");
    }
    
}



export function correctNavDisplay() {
  const loginBtn = document.getElementById("login");
  const logoutBtn = document.getElementById("logout");
  const adminBtn = document.getElementById("adminPageBtn");

  const clubAuth = localStorage.getItem("loggedInStudent");
  const isGod = localStorage.getItem("isGod");
  const loggedIn = clubAuth === "true" || isGod === "true";

  if (loggedIn) {
    if (loginBtn) loginBtn.style.display = "none";

    if (logoutBtn) {
      logoutBtn.style.display = "inline-block";
      logoutBtn.onclick = function () {
        if (isGod === "true") {
          signOut(auth)
            .then(() => {
              localStorage.clear();
              location.reload();
            })
            .catch((error) => {
              console.error("Error signing out:", error);
            });
        } else {
          localStorage.clear();
          location.reload();
        }
      };
    }

    if (isGod === "true" && adminBtn) adminBtn.style.display = "inline-block";
  } else {
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (adminBtn) adminBtn.style.display = "none";
  }
}
