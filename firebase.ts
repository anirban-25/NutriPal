// Import the functions you need from the SDKs you need
import { getAuth } from "@firebase/auth";
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBjhkxoKoibJOgOpLbd_9yIU3rRXOIODS4",
    authDomain: "fitness-friend-a71e8.firebaseapp.com",
    projectId: "fitness-friend-a71e8",
    storageBucket: "fitness-friend-a71e8.firebasestorage.app",
    messagingSenderId: "968157587946",
    appId: "1:968157587946:web:3a3fd06d4ebdfc7cee2a93"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
export {app, db,storage, auth}
