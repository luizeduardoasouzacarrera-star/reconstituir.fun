// profiles.js
import { db, rtdb } from "./firebase.js"; // db = Firestore, rtdb = Realtime Database
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref as rRef, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Elementos
const profilesContainer = document.getElementById("profiles");

// URLs padrão de redes sociais
const socialIcons = {
  roblox: "https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/0/e/e/0eeeb19633422b1241f4306419a0f15f39d58de9.png",
  instagram: "https://elementos.apresto.com.br/wp-content/uploads/2024/05/icon-Instagram-desenho.svg",
  tiktok: "https://cdn.worldvectorlogo.com/logos/tiktok-icon-2.svg",
  valorant: "https://www.svgrepo.com/show/424912/valorant-logo-play-2.svg",
  steam: "https://img.icons8.com/?size=50&id=pOa8st0SGd5C&format=png",
  twitter: "https://cdn.freelogovectors.net/wp-content/uploads/2023/07/x-logo-twitter-freelogovectors.net_.png",
  spotify: "https://upload.wikimedia.org/wikipedia/commons/a/a1/2024_Spotify_logo_without_text_%28black%29.svg"
};

// Função para criar cada card
async function createProfileCard(userId, data) {
  const card = document.createElement("div");
  card.classList.add("profile-card");

  // Cor do perfil
  const color = data.color || "#5865f2";
  card.style.borderTop = `5px solid ${color}`;

  // Status online/offline
  const status = document.createElement("div");
  status.classList.add("status-indicator");
  status.style.position = "absolute";
  status.style.top = "10px";
  status.style.left = "10px";
  status.style.display = "flex";
  status.style.alignItems = "center";
  status.style.gap = "5px";
  
  const statusDot = document.createElement("span");
  statusDot.classList.add("status-bubble", "offline");
  
  const statusText = document.createElement("span");
  statusText.textContent = "OFFLINE";
  statusText.style.fontSize = "12px";
  statusText.style.fontWeight = "bold";

  status.appendChild(statusDot);
  status.appendChild(statusText);
  card.appendChild(status);

  // Atualização do status em tempo real
  const onlineRef = rRef(rtdb, `status/${userId}`);
  onValue(onlineRef, (snapshot) => {
    const isOnline = snapshot.val() || false;
    if (isOnline) {
      statusDot.classList.remove("offline");
      statusDot.classList.add("online");
      statusText.textContent = "ONLINE";
    } else {
      statusDot.classList.remove("online");
      statusDot.classList.add("offline");
      statusText.textContent = "OFFLINE";
    }
  });

  // Banner
  const banner = document.createElement("div");
  banner.classList.add("banner");
  banner.style.backgroundImage = `url('${data.bannerURL || ""}')`;
  card.appendChild(banner);

  // Avatar
  const avatar = document.createElement("img");
  avatar.classList.add("avatar");
  avatar.src = data.avatarURL || "";
  card.appendChild(avatar);

  // Nome e bio
  const nameEl = document.createElement("strong");
  nameEl.textContent = data.displayName || userId;
  card.appendChild(nameEl);

  if (data.bio) {
    const bioEl = document.createElement("p");
    bioEl.textContent = data.bio;
    card.appendChild(bioEl);
  }

  // Redes sociais
  const socialsDiv = document.createElement("div");
  socialsDiv.classList.add("socials");
  Object.keys(socialIcons).forEach(key => {
    if (data[key]) {
      const a = document.createElement("a");
      a.href = data[key];
      a.target = "_blank";
      const img = document.createElement("img");
      img.src = socialIcons[key];
      a.appendChild(img);
      socialsDiv.appendChild(a);
    }
  });
  card.appendChild(socialsDiv);

  // Botão de música
  if (data.music) {
    const audioBtn = document.createElement("button");
    audioBtn.textContent = "▶️ Tocar música";
    audioBtn.style.marginTop = "10px";
    audioBtn.style.padding = "8px 14px";
    audioBtn.style.border = "none";
    audioBtn.style.borderRadius = "6px";
    audioBtn.style.background = "#1db954";
    audioBtn.style.color = "#fff";
    audioBtn.style.cursor = "pointer";

    const audio = new Audio(`assets/${data.music}`);
    audioBtn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        audioBtn.textContent = "⏸️ Pausar música";
      } else {
        audio.pause();
        audioBtn.textContent = "▶️ Tocar música";
      }
    });

    card.appendChild(audioBtn);
  }

  profilesContainer.appendChild(card);
}

// Pegar todos os perfis do Firestore
async function loadProfiles() {
  profilesContainer.innerHTML = "";
  const profilesCollection = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js")
    .then(fs => fs.collection(db, "profiles"));

  const snapshot = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js")
    .then(fs => fs.getDocs(profilesCollection));

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    createProfileCard(docSnap.id, data);
  });
}

// Inicializa
loadProfiles();
