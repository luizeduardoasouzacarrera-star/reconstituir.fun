import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const profilesDiv = document.getElementById("profiles");

async function loadProfiles() {
  const snapshot = await getDocs(collection(db, "profiles"));

  profilesDiv.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();

    profilesDiv.innerHTML += `
      <div class="profile-card">
        <div class="profile-name">
          ${data.name || doc.id}
        </div>
      </div>
    `;
  });
}

loadProfiles();
