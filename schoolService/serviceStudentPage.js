import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore,getDoc, doc, updateDoc} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import {logoutUser, checkLoginStatus, getFirstName, getLastName , getEmail, getCurrentUser} from "./serviceAuth.js";
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

export const logout = async function() {
    await logoutUser();
    return true;
};

export const getFirstNameFromAuth = async function(){
    return await getFirstName();
};

export const getLastNameFromAuth = async function(){
    return await getLastName();
};

export const getEmailFromAuth = async function(){
    return await getEmail();
};

export const getHoursFromSubmitHours = async function(){
    return await getTotalHours();
}
export const getHours = async function(){
    const user = await getCurrentUser()
    const uid = user.uid;
    const docRef = doc(db, "students", uid);
    const docFetched= await getDoc(docRef);

    if (!docFetched.exists()) {
        console.log("No such document!");
        return 0;
    }

    const data = docFetched.data();
    const numFields= Object.keys(data).length;
    const numLogs = numFields - 5;
    let hours = 0;

  for (let i = 1; i <= numLogs; i++){
    let mapName = `log${i}`;
    let myMap = data[mapName];
    if (myMap && typeof myMap.totalHours === 'number') {
        hours += myMap.totalHours;
    }
  }

  console.log("working " + hours);
  return hours;
};

// Semicolon added to prevent ASI issues
;(async () => {
    const loggedIn = await checkLoginStatus();
    if (!loggedIn) {
        window.location.href = "serviceStudentLogin.html";
    }
})();
