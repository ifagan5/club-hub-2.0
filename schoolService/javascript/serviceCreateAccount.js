import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
// TODO: import libraries for Cloud Firestore Database
// https://firebase.google.com/docs/firestore
import { getFirestore, collection, query, getCountFromServer, where, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyDKBBs0TWerQno_u8yjNqV5qmvQImf6xA0",
    authDomain: "club-hub-2.firebaseapp.com",
    projectId: "club-hub-2",
    storageBucket: "club-hub-2.firebasestorage.app",
    messagingSenderId: "339870020143",
    appId: "1:339870020143:web:cc698c287ed642e3798cda",
    measurementId: "G-P97ML6ZP15"
  };

    // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const auth = getAuth(app);

// export const nameNewUser = async function(user, pass){
//   await setDoc(doc(db, "clubs", user), {
//     username: user,
//     password: pass
//   });
// }
// creates new document in firebase per club; name of document is the username(which users should set as their club's name)
export const registerService = async function(user, pass){
    //added feature so that does not create new club in firebase until after more information page, in case someone goes to register page instead of login. Also fixed alert for if username already exits; wasnot showing up and was allowithrough to more info page
      // var username = document.getElementById('username').value;
      // var password = document.getElementById('password').value;
      // const docRef = doc(db, "clubs", user);
      const q = query(collection(db, "students"), where("username", "==", user));
      // const querySnapshot = await getDocs(q);
      // creates immediate snapshot document of data currently
      const snapshot = await getCountFromServer(q);
      console.log(snapshot.data().count);
      console.log("hello");
      // testing if username exists
      if(snapshot.data().count != 0){
        console.log("hiiii");
        console.log("username exists");
        // alert!!
          alert("An account with this email already exists. Please try again.");
          // stops function so that club cannot create an account with an already-in-use username
          return;
      }
    
          console.log(user);
      // saving username across pages
      localStorage.setItem("serviceEmail", user);
      localStorage.setItem("servicePassword", pass)
      // switches page to more information page beyond registration page
      window.location.href="serviceStudentPage.html";
        
      // })
      // .catch((error) => {
      //   console.error("Error checking document:", error);
      // });
    // Add a new document in collection "clubs"
    
      // await addDoc(collection(db, "clubs", user), {
        
      // });
      
    }