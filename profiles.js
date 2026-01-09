// profiles.js
import { auth, db } from "./firebase.js";
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const myProfileDiv = document.getElementById("myProfile");
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

// Cria o card de perfil (usado para "Meu Perfil" e Perfis Públicos)
function createProfileCard(userId, data, container) {
  const card = document.createElement("div");
  card.classList.add("profile-card");
  card.style.setProperty("--profile-color", data.color || "#5865f2");

  const banner = document.createElement("div");
  banner.classList.add("banner");
  banner.style.backgroundImage = `url('${data.bannerURL || ""}')`;
  card.appendChild(banner);

  const avatar = document.createElement("img");
  avatar.classList.add("avatar");
  avatar.src = data.avatarURL || "";
  card.appendChild(avatar);

  const nameEl = document.createElement("strong");
  nameEl.textContent = data.displayName || userId;

  // Adiciona emoji se desbloqueado
  if (data.emojiUnlocked && data.emoji) {
    nameEl.textContent += ` ${data.emoji}`;
  }

  card.appendChild(nameEl);

  if (data.bio) {
    const bioEl = document.createElement("p");
    bioEl.textContent = data.bio;
    bioEl.style.color = data.bioColor || "#fff";
    card.appendChild(bioEl);
  }

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
    audioBtn.style.background = data.musicBtnColor || "#1db954";

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

  container.appendChild(card);
}

// Carrega os perfis
async function loadProfiles(user) {
  profilesContainer.innerHTML = "";
  myProfileDiv.innerHTML = "";

  // Primeiro, carrega o perfil do usuário logado
  const mySnap = await getDoc(doc(db, "profiles", user.uid));
  if (mySnap.exists()) {
    createProfileCard(user.uid, mySnap.data(), myProfileDiv);
  }

  // Depois, carrega os outros perfis públicos
  const snapshot = await getDocs(collection(db, "profiles"));
  snapshot.forEach(docSnap => {
    if (docSnap.id !== user.uid && docSnap.data().public) {
      createProfileCard(docSnap.id, docSnap.data(), profilesContainer);
    }
  });
}

// Inicializa quando o usuário estiver logado
auth.onAuthStateChanged(user => {
  if (!user) return;
  loadProfiles(user);
});
