import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUCQaEwrSrDENvToNAgW8KHYrbt96DlnU",
  authDomain: "slidecraft-admin.firebaseapp.com",
  projectId: "slidecraft-admin",
  storageBucket: "slidecraft-admin.firebasestorage.app",
  messagingSenderId: "941977296760",
  appId: "1:941977296760:web:168eba8e89acd5098a328d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
