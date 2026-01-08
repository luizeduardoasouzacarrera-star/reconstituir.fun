// profiles.js
import { db, auth } from "./firebase.js";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ===== ELEMENTOS =====
const nameInput = document.getElementById("nameInput");
const bioInput = document.getElementById("bioInput");
const avatarInput = document.getElementById("avatarInput");
const bannerInput = document.getElementById("bannerInput");
const colorInput = document.getElementById("colorInput"); // cor do perfil
const publicCheckbox = document.getElementById("publicCheckbox");
const saveProfileBtn = document.getElementById("saveProfile");
const profilesContainer = document.getElementById("profiles");

// ===== FUNÇÃO PARA CRIAR CARD =====
function createProfileCard(profileData) {
  const card = document.createElement("div");
  card.classList.add("profile-card");

  // Banner
  const banner = document.createElement("div");
  banner.classList.add("banner");
  banner.style.backgroundImage = `url(${profileData.bannerURL || ""})`;
  card.appendChild(banner);

  // Avatar
  const avatar = document.createElement("img");
  avatar.classList.add("avatar");
  avatar.src = profileData.avatarURL || "https://via.placeholder.com/60";
  card.appendChild(avatar);

  // Nome
  const name = document.createElement("strong");
  name.textContent = profileData.displayName || "Usuário sem nome";
  card.appendChild(name);

  // Bio
  const bio = document.createElement("p");
  bio.textContent = profileData.bio || "";
  card.appendChild(bio);

  // Cor personalizada
  card.style.borderLeft = `6px solid ${profileData.color || "#5865f2"}`;

  return card;
}

// ===== FUNÇÃO PARA SALVAR PROFILE =====
async function saveProfile() {
  const user = auth.currentUser;
  if (!user) return alert("Você precisa estar logado!");

  const profileRef = doc(db, "profiles", user.uid);

  await setDoc(profileRef, {
    displayName: nameInput.value || "Usuário sem nome",
    bio: bioInput.value || "",
    avatarURL: avatarInput.value || "",
    bannerURL: bannerInput.value || "",
    color: colorInput.value || "#5865f2",
    public: publicCheckbox.checked
  });

  alert("Perfil salvo com sucesso!");
}

// ===== MOSTRAR TODOS OS PERFIS PÚBLICOS =====
async function loadPublicProfiles() {
  profilesContainer.innerHTML = "";
  const q = query(collection(db, "profiles"), where("public", "==", true));
  onSnapshot(q, (snapshot) => {
    profilesContainer.innerHTML = "";
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const card = createProfileCard(data);
      profilesContainer.appendChild(card);
    });
  });
}

// ===== EVENTOS =====
if (saveProfileBtn) {
  saveProfileBtn.addEventListener("click", saveProfile);
}

// ===== CARREGAR PERFIS AUTOMATICAMENTE =====
loadPublicProfiles();
