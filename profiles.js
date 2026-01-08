// profiles.js
import { db } from "./firebase.js";
import { collection, onSnapshot } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const profiles = document.getElementById("profiles");

onSnapshot(collection(db, "profiles"), snapshot => {
  profiles.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();
    profiles.innerHTML += `
      <div class="profile-card">
        <strong>${data.username}</strong>
      </div>
    `;
  });
});
