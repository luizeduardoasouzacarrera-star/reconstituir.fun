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

function createProfileCard(userId, data) {
  const card = document.createElement("div");
  card.className = "profile-card";

  // Cor do layout (como antes)
  card.style.boxShadow = `0 0 0 2px ${data.color || "#5865f2"}`;

  const banner = document.createElement("div");
  banner.className = "banner";
  banner.style.backgroundImage = `url('${data.bannerURL || ""}')`;
  card.appendChild(banner);

  const avatar = document.createElement("img");
  avatar.className = "avatar";
  avatar.src = data.avatarURL || "";
  card.appendChild(avatar);

  const name = document.createElement("strong");
  name.textContent = data.displayName || userId;
  card.appendChild(name);

  if (data.bio) {
    const bio = document.createElement("p");
    bio.textContent = data.bio;
    bio.style.color = data.bioColor || "#cccccc";
    card.appendChild(bio);
  }

  const socials = document.createElement("div");
  socials.className = "socials";

  Object.keys(socialIcons).forEach(key => {
    if (data[key]) {
      const a = document.createElement("a");
      a.href = data[key];
      a.target = "_blank";

      const img = document.createElement("img");
      img.src = socialIcons[key];

      a.appendChild(img);
      socials.appendChild(a);
    }
  });

  card.appendChild(socials);

  if (data.music) {
    const btn = document.createElement("button");
    btn.textContent = "▶️ Tocar música";
    btn.style.marginTop = "10px";
    btn.style.background = data.musicBtnColor || "#1db954";
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.borderRadius = "6px";
    btn.style.padding = "8px 14px";
    btn.style.cursor = "pointer";

    const audio = new Audio(`assets/${data.music}`);

    btn.onclick = () => {
      if (audio.paused) {
        audio.play();
        btn.textContent = "⏸️ Pausar música";
      } else {
        audio.pause();
        btn.textContent = "▶️ Tocar música";
      }
    };

    card.appendChild(btn);
  }

  profilesContainer.appendChild(card);
}

async function loadProfiles() {
  profilesContainer.innerHTML = "";
  const snap = await getDocs(collection(db, "profiles"));

  snap.forEach(doc => {
    if (doc.data().public) {
      createProfileCard(doc.id, doc.data());
    }
  });
}

loadProfiles();
