// profiles.js
import { db } from "./firebase.js";
import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const profilesContainer = document.getElementById("profiles");

const profilesRef = collection(db, "profiles");

onSnapshot(profilesRef, snapshot => {
  profilesContainer.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();

    profilesContainer.innerHTML += `
      <div class="profile-card">
        <strong>${data.username}</strong>
      </div>
    `;
  });
});
