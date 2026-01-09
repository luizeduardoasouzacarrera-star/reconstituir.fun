// profiles.js
import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Container
const profilesContainer = document.getElementById("profiles");

// Ícones sociais
const socialIcons = {
  roblox: "https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/0/e/e/0eeeb19633422b1241f4306419a0f15f39d58de9.png",
  instagram: "https://elementos.apresto.com.br/wp-content/uploads/2024/05/icon-Instagram-desenho.svg",
  tiktok: "https://cdn.worldvectorlogo.com/logos/tiktok-icon-2.svg",
  valorant: "https://www.svgrepo.com/show/424912/valorant-logo-play-2.svg",
  steam: "https://img.icons8.com/?size=50&id=pOa8st0SGd5C&format=png",
  twitter: "https://cdn.freelogovectors.net/wp-content/uploads/2023/07/x-logo-twitter-freelogovectors.net_.png",
  spotify: "https://upload.wikimedia.org/wikipedia/commons/a/a1/2024_Spotify_logo_without_text_%28black%29.svg"
};

// Criar card
function createProfileCard(userId, data) {
  const card = document.createElement("div");
  card.className = "profile-card";

  // ✅ COR DO PERFIL (correta)
  const color = data.color || "#5865f2";
  card.style.setProperty("--profile-color", color);

  // Banner
  const banner = document.createElement("div");
  banner.className = "banner";
  banner.style.backgroundImage = `url('${data.bannerURL || ""}')`;
  card.appendChild(banner);

  // Avatar
  const avatar = document.createElement("img");
  avatar.className = "avatar";
  avatar.src = data.avatarURL || "";
  card.appendChild(avatar);

  // Nome
  const nameEl = document.createElement("strong");
  nameEl.textContent = data.displayName || userId;
  card.appendChild(nameEl);

  // Bio
  if (data.bio) {
    const bioEl = document.createElement("p");
    bioEl.textContent = data.bio;
    card.appendChild(bioEl);
  }

  // Redes sociais
  const socialsDiv = document.createElement("div");
  socialsDiv.className = "socials";

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

  // Música
  if (data.music) {
    const btn = document.createElement("button");
    btn.textContent = "▶️ Tocar música";
    btn.style.marginTop = "10px";
    btn.style.padding = "8px 14px";
    btn.style.border = "none";
    btn.style.borderRadius = "6px";
    btn.style.background = "#1db954";
    btn.style.color = "#fff";
    btn.style.cursor = "pointer";

    const audio = new Audio(`assets/${data.music}`);

    btn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        btn.textContent = "⏸️ Pausar música";
      } else {
        audio.pause();
        btn.textContent = "▶️ Tocar música";
      }
    });

    card.appendChild(btn);
  }

  profilesContainer.appendChild(card);
}

// Carregar perfis públicos
async function loadProfiles() {
  profilesContainer.innerHTML = "";

  const snap = await getDocs(collection(db, "profiles"));

  snap.forEach(docSnap => {
    const data = docSnap.data();

    // respeita checkbox "public"
    if (data.public) {
      createProfileCard(docSnap.id, data);
    }
  });
}

loadProfiles();
