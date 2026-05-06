// Imports
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

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
// setting vars
const app = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);



// was having problems with rendering the users name on club page due to improper async handeling
export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            unsubscribe();
            resolve(user);
        }, reject);
    });
};

export async function sendVerificationEmail() {
    try {
        const user = await getCurrentUser()
        if (user) {
            await sendEmailVerification(user);
        }
        alert("Please check your email to verify your account!");
    } catch (err) {
        console.error("Error sending verification email:", err);
    }
}

export async function checkVerificationEmailStatus() {
    const user = await getCurrentUser()
    if (user) {
        return user.emailVerified;
    }
}

/*
createUser(email, password, firstName, lastName, gradYr)

creates a student under "students" in firebase and stores their uid, email, firstName, lastName, gradYr, admin, and 
createdAt based on their inputs. 
*/
// Create a new user (Firebase Auth + Firestore profile)
export async function createUser(email, password, firstName, lastName, gradYr) {
    try {
        const isAdmin = false;

        // Create the auth record
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        // await signInWithEmailAndPassword(auth, email, password);

        // Store a profile document – not password because bad
        await setDoc(doc(db, "students", uid), {
            uid,
            email,
            firstName,
            lastName,
            gradYr,
            admin: isAdmin,
            createdAt: serverTimestamp(),
        });

        await sendVerificationEmail()

        alert("You have been sent a verification email. Please verify your account and then login.");
        window.location.href = "./serviceStudentLogin.html";

        return true;
    } catch (err) {
        alert("Account creation failed: " + err.message);
        console.error("createUser error:", err);
        return false;
    }
}

// check if the user had admin perms
/*
checkAdminStatus()
Checks in the user's "admin" field is set to true and returns true if it is a false if not
*/
export async function checkAdminStatus() {
    const user = await getCurrentUser();
    if (!user) return false;
    const docRef = doc(db, "students", user.uid);
    const docSnap = await getDoc(docRef);
    const userData = docSnap.data();
    if (docSnap.exists()) {
        return userData.admin === true;
    }
    return false;
}

// logs the user in
/*
loginUser(email, password)
logs in the user and checks if they are an admin or not. Based on admin status it replaces the location
with serviceAdminPanel.html (for admin) and serviceStudentPage.html (for other)
*/
export async function loginUser(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        const user = await getCurrentUser();
        if (await checkVerificationEmailStatus() !== true) {
            alert("You have been sent a verification email. Please verify your account to continue.");

            if (confirm("Would you like to be sent a new verification email?")) {
                await sendVerificationEmail();
            }

            await logoutUser()
            window.location.href = "./serviceStudentLogin.html";
        }

        if (await checkAdminStatus()) {
            window.location.href = "./serviceAdminPanel.html";
            return { success: true };
        } else {
            window.location.href = "./serviceStudentPage.html";
            return { success: true };
        }


    } catch (err) {
        alert("Login failed: " + err.message);
        console.warn("loginUser error:", err);
        return { success: false, error: err };
    }
}

// Log out
/*
logoutUser()
logs out the user and replaces the location with serviceHome.html
*/
export async function logoutUser() {
    try {
        await signOut(auth);
        window.location.href = "./serviceHome.html";
    } catch (err) {
        alert("Logout failed: " + err.message);
        console.error("logout error:", err);
    }
}


// Check if a user is already signed in
/*
checkLoginStatus()
Checks if a user is logged in and returns true if one is and returns false if one is not
*/
export async function checkLoginStatus() {
    return await getCurrentUser();
}

// Check if a user is already signed in
/*
checkLoginStatusNoRedirect()
Checks if a user is logged in and returns true if one is and returns false if one is not
*/
export async function checkLoginStatusNoRedirect() {
    return await getCurrentUser();
}

// Get the current user's first name
/*
getFirstName()
uses the user's uid to get the information under firstName and returns it
*/
export async function getFirstName() {
    const user = await getCurrentUser();
    if (!user) return null;

    const docRef = doc(db, "students", user.uid);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? docSnap.data().firstName : null;
}

// Get the current user's last name
/*
getLastName()
uses the user's uid to get the information under lastName and returns it
*/
export async function getLastName() {
    const user = await getCurrentUser();
    if (!user) return null;

    const docRef = doc(db, "students", user.uid);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? docSnap.data().lastName : null;
}

// Get the current user's email
/*
getEmail()
uses the user's uid to get the information under email and returns it
*/
export async function getEmail() {
    const user = await getCurrentUser();
    return user ? user.email : null;
}

// Get the current user's uid
/*
getTotalHours()
uses the user's uid to get the information under totalGeneralHours and returns it, if empty
it returns 0, and otherwise returns null
*/
export async function getTotalHours(){
    const user = await getCurrentUser()
    const uid = user.uid;
    console.log(uid);
    const docRef = doc(db, "students", uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    if (docSnap.exists()) {
        return data.totalGeneralHours || 0;
    }
    return null;
}

// get the total school service hour amount
/*
getTotalSchoolSeriveHours()
uses the user's uid to get the information under totalSchoolHours and returns it, if empty
it returns 0, and otherwise returns null
*/
export async function getTotalSchoolServiceHours(){
    const user = await getCurrentUser()
    const uid = user.uid;
    console.log(uid);
    const docRef = doc(db, "students", uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    if (docSnap.exists()) {
        return data.totalSchoolHours || 0;
    }
    return null;
}

// get the graduation year
/*
getGradYr()
uses the user's uid to get the information under gradYr and returns it, if empty
it returns "0", and otherwise returns null
*/
export async function getGradYr(){
    const user = await getCurrentUser()
    const uid = user.uid;
    console.log(uid);
    const docRef = doc(db, "students", uid);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    if (docSnap.exists()) {
        return data.gradYr || "0";
    }
    return null;
}

// calculate the school service percentage
/*
calculateSchoolServiceHoursPercentage()
uses the user's uid to get the student's graduation year and totalSchoolHours. Then it
uses the graduation requirments based on the year to calculate what percentage of the graduation 
requirment the student has completed and returns the percentage as a number.
*/
export async function calculateSchoolServiceHoursPercentage() {
    const user = await getCurrentUser();
    if (!user) return 0;

    const docRef = doc(db, "students", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const totalSchoolHours = docSnap.data().totalSchoolHours || 0;
        const gradYearFirst = docSnap.data().gradYr || "2030";
        const gradYear = parseInt(gradYearFirst);
        if (gradYear === 2027) {
            const preliminaryResult = (totalSchoolHours / 10) * 100
            return Math.min(preliminaryResult, 100).toFixed(0);
        } else if (gradYear === 2028) {
            const preliminaryResult = (totalSchoolHours / 20) * 100
            return Math.min(preliminaryResult, 100).toFixed(0);
        } else if (gradYear >= 2029) {
            const preliminaryResult = (totalSchoolHours / 30) * 100
            return Math.min(preliminaryResult, 100).toFixed(0);
        } else {
            return 0;
        }

    }
    return 0;
}

// calculate the non-school service percentage
/*
calculateSchoolServiceHoursPercentage()
uses the user's uid to get the student's graduation year and totalGeneralHours. Then it
uses the graduation requirments based on the year to calculate what percentage of the graduation 
requirment the student has completed and returns the percentage as a number.
*/
export async function calculateNonSchoolServiceHoursPercentage() {
    const user = await getCurrentUser();
    if (!user) return 0;

    const docRef = doc(db, "students", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const totalGeneralHours = docSnap.data().totalGeneralHours || 0;
        const gradYearFirst = docSnap.data().gradYr || "2030";
        const gradYear = parseInt(gradYearFirst);
        if (gradYear === 2027) {
            const preliminaryResult = (totalGeneralHours / 30) * 100
            return Math.min(preliminaryResult, 100).toFixed(0);
        } else if (gradYear === 2028) {
            const preliminaryResult = (totalGeneralHours / 15) * 100
            return Math.min(preliminaryResult, 100).toFixed(0);
        } else if (gradYear >= 2029) {
            // const preliminaryResult = (totalGeneralHours / 0) * 100
            // return Math.min(preliminaryResult, 100);
            return "N/A";
        } else {
            return 0;
        }

    }
    return 0;
}

// Function to display all the students logs.
export async function displayAllStudentLogs(divId, studentUid = null) {
    // Delete Past Logs
    const existingLogs = document.querySelectorAll(`[id^="${divId}"]`);
    existingLogs.forEach(element => {
        if (element.id !== divId) element.remove();
    });

    let uid = studentUid;
    if (!uid) {
        // Get current user
        const user = await getCurrentUser();
        uid = user.uid;
    }

    // Get logs
    const logsRef = collection(db, "studentServiceLog", uid, "logs");
    const docSnap = await getDocs(logsRef);

    // Define div to clone
    const originalDiv = document.getElementById(divId);
    originalDiv.style.backgroundColor = "rgb(141,13,24)";
    originalDiv.style.color = "rgb(243, 232, 234)";
    originalDiv.style.padding = " 15px 15px";
    originalDiv.style.borderRadius = "15px";
    originalDiv.style.marginBottom = "15px";
    originalDiv.style.width = "85%";
    originalDiv.style.display = "none";

    const isAdmin = await checkAdminStatus() || false;

    if (docSnap.empty) {
        const noOppMsg = document.createElement("p");
        noOppMsg.innerText = "You do not have any logs recorded.";
        originalDiv.parentNode.appendChild(noOppMsg);
    }


    let i = 0;
    docSnap.forEach((doc) => {
        const data = doc.data();
        const contact = data.contact;
        const date = data.date;
        const description = data.description;
        const hours = data.schoolServiceHours || data.hours;
        const type = data.schoolServiceHours ? "School Service" : "General Service";
        const timestamp = data.timestamp;

        // clone the div to where it needs to go
        const clonedDiv = originalDiv.cloneNode(true);
        clonedDiv.id = `${divId}${i}`; // Update ID for uniqueness
        clonedDiv.style.display = "block";
        clonedDiv.querySelector('#activity').id = `activity${i}`;
        clonedDiv.querySelector('#logged-hours').id = `logged-hours${i}`;
        clonedDiv.querySelector('#logged-hours-to-school').id = `logged-hours-to-school${i}`;
        clonedDiv.querySelector('#date').id = `date${i}`;
        clonedDiv.querySelector('#contact').id = `contact${i}`;

        // Update text content of the cloned elements
        clonedDiv.querySelector(`#activity${i}`).innerText = "Activity: " + description;
        clonedDiv.querySelector(`#logged-hours${i}`).innerText = "Hours: " + hours;
        clonedDiv.querySelector(`#logged-hours-to-school${i}`).innerText = "Type of Service: " + type;
        clonedDiv.querySelector(`#date${i}`).innerText = "Date Completed: " + date;
        clonedDiv.querySelector(`#contact${i}`).innerText = "Contact Person: " + contact;

        // add edit button if admin logged in
        if (isAdmin) {
            const editBtn = document.createElement("button");
            editBtn.innerText = "Edit Log";
            editBtn.onclick = () => {
                sessionStorage.setItem("editLogId", doc.id);
                window.location.href = "./serviceEditLog.html";
            };
            clonedDiv.appendChild(editBtn);
        }

        // add delete button if admin is logged in
        if (isAdmin) {
            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Delete Log";
            deleteBtn.style.marginLeft = "10px";
            deleteBtn.onclick = async () => {
                await deleteDoc(doc.ref);
                window.location.reload();
            };
            clonedDiv.appendChild(deleteBtn);
        }

        // Make clone visible
        clonedDiv.style.display = "block";

        // Append the cloned div to the parent of the original div
        originalDiv.parentNode.appendChild(clonedDiv);

        // Increase i
        i++;
    });
}

// Function to display all student service opportunities
export async function displayAllStudentServiceOpportunities(divId, onlyUsers) {
    // Delete Any Cloned Service Opportunities
    // const existingLogs = document.querySelectorAll('[id^=divId]');
    // existingLogs.forEach(element => {
    //     if (element.id !== divId) element.remove();
    // });

    const user = await getCurrentUser();
    const uid = user.uid;

    const originalDiv = document.getElementById(divId);
    originalDiv.style.display = "none";

    const q = query(collection(db, "serviceOpportunities"), orderBy("opportunityDate", "desc"));
    const querySnapshot = await getDocs(q);

    let id = 0;
    let needsReload = false;
    for (const doc of querySnapshot.docs) {
        const data = doc.data();

        const timestamp = new Date(`${data.opportunityDate}T${data.opportunityTime}`);
        const currentDate = new Date();
        const differenceTimeInMs = currentDate.getTime() - timestamp.getTime();
        const FOURTEEN_DAYS_IN_MS = 14 * 24 * 60 * 60 * 1000;
        const isPast = differenceTimeInMs > FOURTEEN_DAYS_IN_MS;

        if (isPast) {
            console.log("Deleting past opportunity: " + data.opportunityName);
            await deleteDoc(doc.ref);
            needsReload = true;
            continue;
        }

        if (onlyUsers) {
            if (!data.signedUpUsers || !data.signedUpUsers.includes(uid)) {
                continue;
            }
        }

        const clonedDiv = originalDiv.cloneNode(true);
        clonedDiv.style.display = 'block';
        clonedDiv.id = `opportunity${id}`;

        // Target the correct IDs from the opportunity1 HTML
        clonedDiv.querySelector('#opportunityName').id = `opportunityName${id}`;
        clonedDiv.querySelector('#opportunityDescription').id = `opportunityDescription${id}`;
        clonedDiv.querySelector('#opportunityLength').id = `opportunityLength${id}`;
        clonedDiv.querySelector('#opportunityDate').id = `opportunityDate${id}`;
        clonedDiv.querySelector('#opportunityTime').id = `opportunityTime${id}`;
        clonedDiv.querySelector('#opportunityLocation').id = `opportunityLocation${id}`;

        const button = clonedDiv.querySelector('#opportunityButton');
        button.id = `opportunityButton${id}`;

        clonedDiv.style.backgroundColor = "rgb(141,13,24)";
        clonedDiv.style.color = "rgb(243, 232, 234)";
        clonedDiv.style.padding = " 15px 15px";
        clonedDiv.style.borderRadius = "15px";
        clonedDiv.style.marginBottom = "15px";
        clonedDiv.style.width = "85%";

        // Update text content of the cloned elements using the new IDs
        clonedDiv.querySelector(`#opportunityName${id}`).textContent = "Name: " + data.opportunityName;
        clonedDiv.querySelector(`#opportunityDescription${id}`).textContent = "Description: " + data.opportunityDescription;
        clonedDiv.querySelector(`#opportunityLength${id}`).textContent = "Length: " + data.opportunityLength;
        clonedDiv.querySelector(`#opportunityDate${id}`).textContent = "Date: " + data.opportunityDate + " @ " + data.opportunityTime;
        clonedDiv.querySelector(`#opportunityLocation${id}`).textContent = "Location: " + data.opportunityLocation;
        button.textContent = "View Service Opportunity";
        button.onclick = () => {
            sessionStorage.setItem("opportunityName", data.opportunityName);
            sessionStorage.setItem("opportunityId", doc.id);
            window.location.href = "./serviceViewOpportunity.html";
        };

        // Append the cloned div to the parent of the original div
        originalDiv.parentNode.appendChild(clonedDiv);
        id++;
    }

    if (id === 0 && onlyUsers) {
        const noOppMsg = document.createElement("p");
        noOppMsg.innerText = "You are not signed up for any opportunities.";
        originalDiv.parentNode.appendChild(noOppMsg);
    }

    if (needsReload) {
        window.location.reload();
    }
    //haha
}