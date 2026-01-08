// profiles.js
import { db } from "./firebase.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const profiles = document.getElementById("profiles");

onSnapshot(collection(db, "profiles"), snapshot => {
  profiles.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();

    profiles.innerHTML += `
      <div class="profile-card" style="background-image: url('${data.bannerURL || ''}'); background-size: cover;">
        <img src="${data.avatarURL || 'https://via.placeholder.com/80'}" alt="Avatar" style="width:80px; height:80px; border-radius:50%; display:block; margin-bottom:10px;">
        <strong>${data.displayName || data.username || "Usuário sem nome"}</strong>
        <p>${data.bio || ''}</p>
      </div>
    `;
  });
});
