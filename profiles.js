import { db, auth } from "./firebase.js";
import { collection, onSnapshot, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const profiles = document.getElementById("profiles");

// cores disponíveis para troca
const colors = ["#5865F2", "#57F287", "#EB459E", "#FEE75C", "#ED4245"];

onSnapshot(collection(db, "profiles"), snapshot => {
  profiles.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const id = docSnap.id;

    const card = document.createElement("div");
    card.classList.add("profile-card");
    card.style.background = data.color || "#141428";

    card.innerHTML = `
      <div class="banner" style="background-image:url('${data.bannerURL || 'https://whitescreen.dev/images/pro/black-screen_39.png'}')"></div>
      <div class="avatar" style="background-image:url('${data.avatarURL || 'https://whitescreen.dev/images/pro/black-screen_39.png'}')"></div>
      <div class="info">
        <strong>${data.displayName || data.username || "Usuário sem nome"}</strong>
        <p>${data.bio || ""}</p>
        <div class="color-palette">
          ${colors.map(c => `<div class="color-option" style="background:${c}" data-color="${c}"></div>`).join("")}
        </div>
      </div>
    `;

    // troca de cor se for o usuário logado
    if (auth.currentUser && auth.currentUser.email.split("@")[0] === data.username) {
      const palette = card.querySelectorAll(".color-option");
      palette.forEach(div => {
        div.addEventListener("click", async () => {
          card.style.background = div.dataset.color;
          await updateDoc(doc(db, "profiles", id), { color: div.dataset.color });
        });
      });
    } else {
      // se não for usuário logado, remove paleta
      const paletteDiv = card.querySelector(".color-palette");
      paletteDiv.remove();
    }

    profiles.appendChild(card);
  });
});
