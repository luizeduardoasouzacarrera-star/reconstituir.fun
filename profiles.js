// profile.js
import { db, auth } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ===== ELEMENTOS =====
const profilesContainer = document.querySelector(".profiles-section");
const profilesGrid = document.querySelector(".profiles-grid");

// ===== FUNÇÃO PARA CRIAR CARD =====
function createProfileCard(profileData, userId) {
  const card = document.createElement("div");
  card.classList.add("profile-card");

  // Banner
  const banner = document.createElement("div");
  banner.classList.add("banner");
  banner.style.backgroundImage = `url(${profileData.bannerURL || ""})`;
  card.appendChild(banner);

  // Barra de cor
  const colorBar = document.createElement("div");
  colorBar.classList.add("color-bar");
  colorBar.style.height = "6px";
  colorBar.style.width = "100%";
  colorBar.style.background = profileData.color || "#5865f2";
  colorBar.style.marginTop = "-6px";
  card.appendChild(colorBar);

  // Avatar
  const avatar = document.createElement("img");
  avatar.classList.add("avatar");
  avatar.src = profileData.avatarURL || "https://whitescreen.dev/images/pro/black-screen_39.png";
  card.appendChild(avatar);

  // Conteúdo
  const content = document.createElement("div");
  content.classList.add("content");

  const name = document.createElement("strong");
  name.textContent = profileData.displayName || profileData.username || "Usuário sem nome";
  content.appendChild(name);

  if (profileData.bio) {
    const bio = document.createElement("p");
    bio.textContent = profileData.bio;
    content.appendChild(bio);
  }

  card.appendChild(content);

  // Input para mudar cor (apenas se for o dono do profile)
  if (auth.currentUser && auth.currentUser.uid === userId) {
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.value = profileData.color || "#5865f2";
    colorPicker.classList.add("color-picker");
    colorPicker.style.marginTop = "10px";
    content.appendChild(colorPicker);

    colorPicker.addEventListener("input", async (e) => {
      const newColor = e.target.value;
      colorBar.style.background = newColor;
      await updateDoc(doc(db, "profiles", userId), { color: newColor });
    });
  }

  return card;
}

// ===== CARREGAR TODOS OS PROFILES =====
export function loadAllProfiles() {
  const profilesRef = collection(db, "profiles");

  onSnapshot(profilesRef, (snapshot) => {
    profilesGrid.innerHTML = ""; // limpa grid
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const userId = docSnap.id;
      const card = createProfileCard(data, userId);
      profilesGrid.appendChild(card);
    });
  });
}

// ===== CRIAR/ATUALIZAR PROFILE DO USUÁRIO =====
export async function createOrUpdateUserProfile(user, profileData) {
  const profileRef = doc(db, "profiles", user.uid);

  const snap = await getDoc(profileRef);
  if (!snap.exists()) {
    await setDoc(profileRef, {
      username: user.email.split("@")[0],
      displayName: profileData.displayName || "",
      avatarURL: profileData.avatarURL || "",
      bannerURL: profileData.bannerURL || "",
      bio: profileData.bio || "",
      color: profileData.color || "#5865f2",
    });
  } else {
    await updateDoc(profileRef, {
      displayName: profileData.displayName || snap.data().displayName,
      avatarURL: profileData.avatarURL || snap.data().avatarURL,
      bannerURL: profileData.bannerURL || snap.data().bannerURL,
      bio: profileData.bio || snap.data().bio,
      color: profileData.color || snap.data().color,
    });
  }
}
