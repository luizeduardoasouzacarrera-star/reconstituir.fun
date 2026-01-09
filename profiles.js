// profiles.js
import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const profilesContainer = document.getElementById("profiles");

const socialIcons = {
  roblox: "https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/0/e/e/0eeeb19633422b1241f4306419a0f15f39d58de9.png",
  instagram: "https://elementos.apresto.com.br/wp-content/uploads/2024/05/icon-Instagram-desenho.svg",
  tiktok: "https://cdn.worldvectorlogo.com/logos/tiktok-icon-2.svg",
  valorant: "https://www.svgrepo.com/show/424912/valorant-logo-play-2.svg",
  steam: "https://img.icons8.com/?size=50&id=pOa8st0SGd5C&format=png",
  twitter: "https://cdn.freelogovectors.net/wp-content/uploads/2023/07/x-logo-twitter-freelogovectors.net_.png",
  spotify: "https://upload.wikimedia.org/wikipedia/commons/a/a1/2024_Spotify_logo_without_text_%28black%29.svg"
};

async function createProfileCard(userId, data) {
  const card = document.createElement("div");
  card.classList.add("profile-card");

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

  // 🔹 CONTAINER INTERNO (AQUI VAI A COR DO PROFILE)
  const content = document.createElement("div");
  content.classList.add("profile-content");
  content.style.background = data.color || "#5865f2";

  // Nome
  const nameEl = document.createElement("strong");
  nameEl.textContent = data.displayName || userId;
  content.appendChild(nameEl);

  // Bio
  if (data.bio) {
    const bioEl = document.createElement("p");
    bioEl.textContent = data.bio;
    bioEl.style.color = data.bioColor || "#ffffff"; // ✅ COR DO TEXTO DA BIO
    content.appendChild(bioEl);
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

  content.appendChild(socialsDiv);

  // Música
  if (data.music) {
    const audioBtn = document.createElement("button");
    audioBtn.textContent = "▶️ Tocar música";
    audioBtn.style.marginTop = "10px";
    audioBtn.style.padding = "8px 14px";
    audioBtn.style.border = "none";
    audioBtn.style.borderRadius = "6px";
    audioBtn.style.cursor = "pointer";
    audioBtn.style.color = "#fff";
    audioBtn.style.background = data.musicBtnColor || "#1db954"; // ✅ COR DO BOTÃO

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

    content.appendChild(audioBtn);
  }

  card.appendChild(content);
  profilesContainer.appendChild(card);
}

async function loadProfiles() {
  profilesContainer.innerHTML = "";
  const snapshot = await getDocs(collection(db, "profiles"));

  snapshot.forEach(docSnap => {
    createProfileCard(docSnap.id, docSnap.data());
  });
}

loadProfiles();
