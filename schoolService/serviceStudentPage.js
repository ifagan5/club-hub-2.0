import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore,getDoc, doc, updateDoc} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import {logoutUser, checkLoginStatus, getFirstName, getLastName , getEmail, getCurrentUser, getGradYr} from "./serviceAuth.js";
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

export const getGradYrFromAuth = async function(){
    return await getGradYr();
};

export const getEmailFromAuth = async function(){
    return await getEmail();
};

export const getHoursFromSubmitHours = async function(){
    return await getTotalHours();
}

export const getCommunityGradRequirement = async function(){
    const grade = await getGradYr();
    if (grade === "2027"){
        return "You need 30 general community service hours before your senior year to graduate"
    }
    else if (grade === "2028"){
        return "You need 15 general community service hours before your senior year to graduate"
    }
    else{
        return "You do not have a general community service graduation requirement"

    }
}

export const getSchoolGradRequirement = async function(){
    const grade = await getGradYr();
    if (grade === "2027"){
        return "You need 10 service to the school hours before your senior year to graduate"
    }
    else if (grade === "2028"){
        return "You need 20 service to the school hours before your senior year to graduate"
    }
    else{
        return "You need 30 service to the school hours before your senior year to graduate"

    }
}


export const getHours = async function(){
    const user = await getCurrentUser()
    const uid = user.uid;
    const docRef = doc(db, "students", uid);
    const docFetched= await getDoc(docRef);
    const numFields= Object.keys(docFetched.data()).length;
    const numLogs = numFields - 5;
    let hours;

  for (let i = 1; i<=numLogs, i++;){
    let mapName = [`log${i}`];
    let myMap = docFetched.data()[mapName];
    let h = myMap[totalHours];
    hours+= h;
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
