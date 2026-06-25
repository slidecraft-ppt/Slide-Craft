import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

document
.getElementById("loginBtn")
.addEventListener("click", async () => {

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    window.location.href =
      "dashboard.html";

  } catch (error) {

    alert(error.message);

  }

});