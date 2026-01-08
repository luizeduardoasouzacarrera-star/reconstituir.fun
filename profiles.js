// profiles.js
import { db, auth } from "./firebase.js";
import { collection, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const profilesContainer = document.getElementById("profiles");

// cores disponíveis na paleta
const colors = ["#2f2f3f", "#5865f2", "#4da6ff", "#ff4757", "#ffa500", "#2ed573"];

onSnapshot(collection(db, "profiles"), snapshot => {
  profilesContainer.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    const card = document.createElement("div");
    card.classList.add("profile-card");

    // definir cor do card
    card.style.setProperty("--profile-color", data.color || "#2f2f3f");

    card.innerHTML = `
      <div class="profile-banner" style="background-image: url('${data.bannerURL || "https://whitescreen.dev/images/pro/black-screen_39.png"}')"></div>
      <div class="profile-main">
        <img src="${data.avatarURL || "https://whitescreen.dev/images/pro/black-screen_39.png"}" class="profile-avatar" />
        <div class="profile-info">
          <strong>${data.displayName || data.username || "Usuário sem nome"}</strong>
          <p>${data.bio || "Sem bio"}</p>
          ${data.uid === auth.currentUser?.uid ? `<div class="color-palette"></div>` : ""}
        </div>
      </div>
    `;

    // se for o usuário logado, criar paleta de cores
    if (data.uid === auth.currentUser?.uid) {
      const paletteDiv = card.querySelector(".color-palette");
      colors.forEach(color => {
        const colorBox = document.createElement("div");
        colorBox.style.backgroundColor = color;
        colorBox.addEventListener("click", async () => {
          card.style.setProperty("--profile-color", color);
          await updateDoc(doc(db, "profiles", data.username), { color });
        });
        paletteDiv.appendChild(colorBox);
      });
    }

    profilesContainer.appendChild(card);
  });
});
