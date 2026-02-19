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

/*
logout
logs out the user by calling logoutUser() from serviceAuth.js
*/
export const logout = async function() {
    await logoutUser();
    return true;
};

/*
getFirstNameFromAuth
gets the user's first name by calling getFirstName() from serviceAuth.js
*/
export const getFirstNameFromAuth = async function(){
    return await getFirstName();
};
/*
getLastNameFromAuth
gets the user's last name by calling getLastName() from serviceAuth.js
*/
export const getLastNameFromAuth = async function(){
    return await getLastName();
};
/*
getLastNamegetGradYrFromAuthFromAuth
gets the user's graduation year by calling getGradYr() from serviceAuth.js
*/
export const getGradYrFromAuth = async function(){
    return await getGradYr();
};
/*
getEmailFromAuth
gets the user's email by calling getEmail() from serviceAuth.js
*/
export const getEmailFromAuth = async function(){
    return await getEmail();
};

/*
getHoursFromSubmitHours
gets and returns the user's totalNonSchoolHours by calling getTotalHours() from serviceAuth.js
*/
export const getHoursFromSubmitHours = async function(){
    return await getTotalHours();
}

/*
getCommunityGradRequirement
gets the user's graduation year by calling getGradYr() from serviceAuth.js and then uses it to 
calculate the total general community service requirement.
Returns a statement like: " you need # general community service hours before your senior year to graduate"
or: "You do not have a general community service graduation requirement"
*/
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
/*
getSchoolGradRequirement
gets the user's graduation year by calling getGradYr() from serviceAuth.js and then uses it to 
calculate the total school community service requirement.
Returns a statement like: " you need # service to the school hours before your senior year to graduate"
*/
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

/*
getHours()
Loops through the student's logs to get total hours (does not exist anymore -- never called and does nothing)
*/
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
    if (loggedIn === false) {
        window.href = "./serviceStudentLogin.html";
    }
})();
