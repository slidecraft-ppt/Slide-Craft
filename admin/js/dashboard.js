import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

document.getElementById("saveBtn").addEventListener("click", async () => {

  try {

    await addDoc(
      collection(db, "templates"),
      {
        title: document.getElementById("title").value,
        category: document.getElementById("category").value,
        thumbnail: document.getElementById("thumbnail").value,
        description: document.getElementById("description").value,
        createdAt: serverTimestamp()
      }
    );

    document.getElementById("status").innerText =
      "Template Added Successfully";

  } catch (error) {

    console.error(error);

    document.getElementById("status").innerText =
      error.message;
  }

});