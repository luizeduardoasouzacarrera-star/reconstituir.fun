import { auth, db } from "./firebase.js";
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { createProfileCard } from "./profiles.js";

const container = document.getElementById("myProfile");

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  onSnapshot(doc(db, "profiles", user.uid), snap => {
    container.innerHTML = "";

    if (!snap.exists()) return;

    const result = createProfileCard(user.uid, snap.data());
    if (result) container.appendChild(result.card);
  });
});
