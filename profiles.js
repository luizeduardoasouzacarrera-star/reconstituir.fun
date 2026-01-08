import { db } from "./firebase.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const profilesDiv = document.getElementById("profiles");

// Atualiza perfis em tempo real
onSnapshot(collection(db, "profiles"), snapshot => {
  profilesDiv.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();
    if (!data.public) return; // só mostra públicos

    profilesDiv.innerHTML += `
      <div class="profile-card">
        ${data.bannerURL ? `<div class="banner" style="background-image:url('${data.bannerURL}')"></div>` : ""}
        <img class="avatar" src="${data.avatarURL || 'default-avatar.png'}" alt="Avatar">
        <strong>${data.displayName || data.username}</strong>
        <p>${data.bio || ""}</p>
      </div>
    `;
  });
});
