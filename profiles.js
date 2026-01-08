// profiles.js
import { db } from "./firebase.js";
import { collection, onSnapshot, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const profiles = document.getElementById("profiles");

// Função para criar o card no estilo Discord
function createProfileCard(data) {
  const card = document.createElement("div");
  card.classList.add("profile-card");

  card.innerHTML = `
    <div class="banner" style="background-image: url('${data.bannerURL || 'https://i.imgur.com/5D6b9F2.png'}')"></div>
    <div class="highlight" style="background-color: ${data.color || '#5865f2'}"></div>
    <div class="profile-info">
      <img class="avatar" src="${data.avatarURL || 'https://i.imgur.com/4c9wQ6A.png'}" alt="Avatar">
      <div class="text-info">
        <strong>${data.displayName || data.username || 'Usuário sem nome'}</strong>
        <div class="bio">${data.bio || ''}</div>
      </div>
    </div>
  `;

  return card;
}

// Listar todos os perfis
onSnapshot(collection(db, "profiles"), snapshot => {
  profiles.innerHTML = "";
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    profiles.appendChild(createProfileCard(data));
  });
});

// Permitir que o usuário atualize a cor de destaque
onAuthStateChanged(auth, user => {
  if (!user) return;

  const userRef = doc(db, "profiles", user.uid);
  // Aqui você pode adicionar um input no HTML tipo <select> com cores
  const colorInput = document.getElementById("colorInput");
  if (colorInput) {
    colorInput.addEventListener("change", async () => {
      await updateDoc(userRef, { color: colorInput.value });
    });
  }
});
