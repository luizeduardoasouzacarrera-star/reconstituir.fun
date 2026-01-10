import { db, auth } from "./firebase.js";
import { collection, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

const isDashboard = !!document.getElementById("sendBtn");
let currentUserUid = null;
let isAdmin = false;

// ✅ EXPORTADO
export function createProfileCard(userId, data) {
  if (!data.public && (!isDashboard || !isAdmin)) return null;

  const card = document.createElement("div");
  card.className = "profile-card";
  card.style.setProperty("--profile-color", data.color || "#5865f2");

  const banner = document.createElement("div");
  banner.className = "banner";
  banner.style.backgroundImage = `url('${data.bannerURL || ""}')`;
  card.appendChild(banner);

  const avatar = document.createElement("img");
  avatar.className = "avatar";
  avatar.src = data.avatarURL || "";
  card.appendChild(avatar);

  const name = document.createElement("strong");
  name.textContent = `${data.displayName || userId}${data.emoji || ""}`;
  card.appendChild(name);

  if (data.bio) {
    const bio = document.createElement("p");
    bio.textContent = data.bio;
    bio.style.color = data.bioColor || "#fff";
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

  if (data.music && data.music.trim() !== "") {
    const audio = new Audio(`assets/${data.music}`);
    const btn = document.createElement("button");
    btn.textContent = "Tocar música";
    btn.style.background = data.musicBtnColor || "#1db954";
    btn.onclick = () => {
      if (audio.paused) {
        audio.play();
        btn.textContent = "Pausar música";
      } else {
        audio.pause();
        btn.textContent = "Tocar música";
      }
    };
    card.appendChild(btn);
  }

  if (isDashboard && isAdmin && userId !== currentUserUid) {
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = data.public ? "❌ Remover público" : "✅ Tornar público";
    toggleBtn.style.background = "#e74c3c";
    toggleBtn.onclick = async () => {
      await updateDoc(doc(db, "profiles", userId), { public: !data.public });
    };
    card.appendChild(toggleBtn);
  }

  return { userId, card };
}

// ===== LISTA NORMAL DE PERFIS =====
if (profilesContainer) {
  onSnapshot(collection(db, "profiles"), snap => {
    profilesContainer.innerHTML = "";
    let cards = [];

    snap.forEach(docSnap => {
      const result = createProfileCard(docSnap.id, docSnap.data());
      if (result) cards.push(result);
    });

    cards.sort((a, b) => {
      if (a.userId === "EIKx6Iz2hRZuzNUkFlvBc8QefSh1") return -1;
      if (b.userId === "EIKx6Iz2hRZuzNUkFlvBc8QefSh1") return 1;
      return 0;
    });

    cards.forEach(c => profilesContainer.appendChild(c.card));
  });
}

// ===== ADMIN =====
if (isDashboard) {
  auth.onAuthStateChanged(user => {
    if (!user) return;
    currentUserUid = user.uid;
    isAdmin = user.uid === "EIKx6Iz2hRZuzNUkFlvBc8QefSh1";
  });
}
