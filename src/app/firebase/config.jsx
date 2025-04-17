import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvwV1dWJ3q0PS7WI_eEJvRLzhIYV0msHM",
  authDomain: "dev-09-287a3.firebaseapp.com",
  projectId: "dev-09-287a3",
  storageBucket: "dev-09-287a3.firebasestorage.app",
  messagingSenderId: "937662718199",
  appId: "1:937662718199:web:1199977658e3b699d873f2",
  measurementId: "G-2PPZFCBVJ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);