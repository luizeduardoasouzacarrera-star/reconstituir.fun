// profiles.js
import { db } from "./firebase.js";
import { collection, onSnapshot, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const profilesContainer = document.getElementById("profiles");
const profileForm = document.getElementById("profileForm");

// Cria profile automático quando usuário loga
onAuthStateChanged(auth, async user => {
  if (!user) return;

  const username = user.email.split("@")[0];

  const profileRef = doc(db, "profiles", username);

  // Verifica se já existe, se não cria com valores padrão
  const snap = await profileRef.get?.();
  if (!snap || !snap.exists?.()) {
    await setDoc(profileRef, {
      username,
      displayName: username,
      bio: "Escreva sua bio aqui",
      avatarURL: "https://whitescreen.dev/images/pro/black-screen_39.png",
      bannerURL: "https://whitescreen.dev/images/pro/black-screen_39.png",
      color: "#5865f2"
    });
  }
});

// Atualiza o card sempre que há mudanças
onSnapshot(collection(db, "profiles"), snapshot => {
  profilesContainer.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    const card = document.createElement("div");
    card.classList.add("profile-card");

    card.innerHTML = `
      <div class="banner" style="background-image: url('${data.bannerURL}')">
        <div class="avatar" style="background-image: url('${data.avatarURL}'); background-size: cover;"></div>
      </div>
      <div class="color-bar" style="background-color: ${data.color || '#5865f2'}"></div>
      <div class="info">
        <strong>${data.displayName}</strong>
        <p>${data.bio}</p>
      </div>
    `;

    profilesContainer.appendChild(card);
  });
});

// Função para atualizar cor via formulário (paleta)
export async function updateColor(username, color) {
  const profileRef = doc(db, "profiles", username);
  await setDoc(profileRef, { color }, { merge: true });
}
