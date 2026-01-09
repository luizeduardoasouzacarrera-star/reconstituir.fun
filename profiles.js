// profiles.js
import { auth, db, rtdb } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref as rtdbRef, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Elemento onde os perfis vão aparecer
const profilesDiv = document.getElementById("profiles");

// URLs das logos das redes sociais
const socialIcons = {
  roblox: "https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/0/e/e/0eeeb19633422b1241f4306419a0f15f39d58de9.png",
  instagram: "https://elementos.apresto.com.br/wp-content/uploads/2024/05/icon-Instagram-desenho.svg",
  tiktok: "https://cdn.worldvectorlogo.com/logos/tiktok-icon-2.svg",
  valorant: "https://www.svgrepo.com/show/424912/valorant-logo-play-2.svg",
  steam: "https://img.icons8.com/?size=50&id=pOa8st0SGd5C&format=png",
  twitter: "https://img.freepik.com/free-vector/new-twitter-logo-x-icon-black-background_1017-45427.jpg",
  spotify: "https://upload.wikimedia.org/wikipedia/commons/a/a1/2024_Spotify_logo_without_text_%28black%29.svg"
};

// Função para carregar todos os perfis
export async function loadAllProfiles() {
  // Limpar div
  profilesDiv.innerHTML = "";

  // Supondo que você tenha IDs dos usuários no Firestore
  // Para cada usuário público
  const users = await getPublicUsers();

  users.forEach(async user => {
    const data = user.data();

    // Criar card
    const card = document.createElement("div");
    card.className = "profile-card";

    // Fundo e borda colorida
    card.style.backgroundColor = data.color || "#141428";
    card.style.border = `2px solid ${data.color || "#5865f2"}`;

    // Banner
    const banner = document.createElement("div");
    banner.className = "banner";
    banner.style.backgroundImage = `url(${data.bannerURL || ""})`;
    card.appendChild(banner);

    // Avatar
    const avatar = document.createElement("img");
    avatar.className = "avatar";
    avatar.src = data.avatarURL || "";
    card.appendChild(avatar);

    // Nome
    const nameEl = document.createElement("strong");
    nameEl.textContent = data.displayName || "Usuário";
    card.appendChild(nameEl);

    // Bio
    const bioEl = document.createElement("p");
    bioEl.textContent = data.bio || "";
    card.appendChild(bioEl);

    // Status Online/Offline
    const statusEl = document.createElement("div");
    statusEl.className = "status-indicator";

    const statusDot = document.createElement("span");
    statusDot.className = "status-bubble offline"; // inicial como offline
    const statusText = document.createElement("span");
    statusText.textContent = "Offline";

    statusEl.appendChild(statusDot);
    statusEl.appendChild(statusText);
    card.appendChild(statusEl);

    // Escutar no Realtime Database se o usuário está online
    const statusRef = rtdbRef(rtdb, `status/${user.id}`);
    onValue(statusRef, snapshot => {
      const val = snapshot.val();
      if (val && val.isOnline) {
        statusDot.className = "status-bubble online";
        statusText.textContent = "Online";
      } else {
        statusDot.className = "status-bubble offline";
        statusText.textContent = "Offline";
      }
    });

    // Redes sociais
    const socialsDiv = document.createElement("div");
    socialsDiv.className = "socials";
    Object.keys(socialIcons).forEach(platform => {
      if (data[platform]) {
        const a = document.createElement("a");
        a.href = data[platform];
        a.target = "_blank";
        const img = document.createElement("img");
        img.src = socialIcons[platform];
        a.appendChild(img);
        socialsDiv.appendChild(a);
      }
    });
    card.appendChild(socialsDiv);

    // Botão de tocar música
    if (data.music) {
      const audio = new Audio(`assets/${data.music}`);
      const musicBtn = document.createElement("button");
      musicBtn.textContent = "▶️ Tocar música";
      musicBtn.style.marginTop = "8px";
      musicBtn.style.padding = "8px 16px";
      musicBtn.style.borderRadius = "6px";
      musicBtn.style.border = "none";
      musicBtn.style.background = "#1DB954"; // verde Spotify
      musicBtn.style.color = "white";
      musicBtn.style.cursor = "pointer";

      musicBtn.addEventListener("click", () => {
        audio.play();
      });

      card.appendChild(musicBtn);
    }

    profilesDiv.appendChild(card);
  });
}

// Função fictícia que retorna todos os usuários públicos do Firestore
async function getPublicUsers() {
  // Aqui você precisa do código que busca os usuários públicos no Firestore
  // Por exemplo, usando collection("profiles") e filtrando public = true
  // Retorne um array de objetos { id: UID, data: perfil }
  const usersArray = [];

  const usersSnap = await getDoc(doc(db, "profiles")); // Ajuste conforme sua estrutura
  // Exemplo fictício, substitua pela query correta
  if (usersSnap.exists()) {
    usersArray.push({ id: usersSnap.id, data: usersSnap.data() });
  }

  return usersArray;
}

// Chamar para carregar perfis
loadAllProfiles();
