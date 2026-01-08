import { db, auth } from "./firebase.js";
import { collection, getDocs, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ===== ELEMENTOS =====
const profilesGrid = document.getElementById("profilesGrid");
const profileForm = document.getElementById("profileForm");
const displayNameInput = document.getElementById("displayName");
const bioInput = document.getElementById("bio");
const avatarInput = document.getElementById("avatarURL");
const bannerInput = document.getElementById("bannerURL");
const colorInput = document.getElementById("color");

// ===== FUNÇÃO PARA CARREGAR TODOS OS PROFILES =====
export async function loadProfiles() {
  profilesGrid.innerHTML = ""; // limpa antes
  const querySnapshot = await getDocs(collection(db, "profiles"));

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    const card = document.createElement("div");
    card.classList.add("profile-card");

    // Banner
    const banner = document.createElement("div");
    banner.classList.add("banner");
    banner.style.backgroundImage = `url(${data.bannerURL || "default-banner.png"})`;
    card.appendChild(banner);

    // Barra de cor
    const colorBar = document.createElement("div");
    colorBar.classList.add("color-bar");
    colorBar.style.background = data.color || "#5865f2";
    card.appendChild(colorBar);

    // Avatar
    const avatar = document.createElement("img");
    avatar.classList.add("avatar");
    avatar.src = data.avatarURL || "default-avatar.png";
    card.appendChild(avatar);

    // Nome
    const name = document.createElement("strong");
    name.textContent = data.displayName || "Usuário sem nome";
    card.appendChild(name);

    // Bio
    const bio = document.createElement("p");
    bio.textContent = data.bio || "";
    card.appendChild(bio);

    profilesGrid.appendChild(card);
  });
}

// ===== FUNÇÃO PARA CRIAR OU ATUALIZAR PERFIL DO USUÁRIO =====
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) return alert("Faça login primeiro!");

  const profileRef = doc(db, "profiles", user.uid);

  await setDoc(profileRef, {
    displayName: displayNameInput.value || "Usuário sem nome",
    bio: bioInput.value || "",
    avatarURL: avatarInput.value || "default-avatar.png",
    bannerURL: bannerInput.value || "default-banner.png",
    color: colorInput.value || "#5865f2"
  });

  profileForm.reset();
  loadProfiles(); // atualiza os cards após criar/editar
});

// ===== CHAMAR FUNÇÃO DE CARREGAMENTO =====
loadProfiles();
