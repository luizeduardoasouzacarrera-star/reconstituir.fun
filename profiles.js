// profiles.js
import { db, auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, doc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Elemento que vai receber os perfis
const profilesDiv = document.getElementById("profiles");

// Realtime Database para status
const rtdb = getDatabase();

// Pegando o usuário atual
let currentUserId = null;
onAuthStateChanged(auth, user => {
  if (!user) return;
  currentUserId = user.uid;
});

// Escutando os perfis públicos no Firestore
const profilesRef = collection(db, "profiles");
onSnapshot(profilesRef, snapshot => {
  profilesDiv.innerHTML = ""; // limpa antes de recriar

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const uid = docSnap.id;

    if (!data.public) return;

    // Criar card
    const card = document.createElement("div");
    card.classList.add("profile-card");
    card.style.borderColor = data.color || "#5865f2"; // COR PERSONALIZADA

    // Status online/offline no canto superior esquerdo
    const statusDiv = document.createElement("div");
    statusDiv.style.position = "absolute";
    statusDiv.style.top = "10px";
    statusDiv.style.left = "10px";
    statusDiv.style.display = "flex";
    statusDiv.style.alignItems = "center";
    statusDiv.style.gap = "6px";

    const statusDot = document.createElement("span");
    statusDot.style.width = "10px";
    statusDot.style.height = "10px";
    statusDot.style.borderRadius = "50%";
    statusDot.style.display = "inline-block";
    statusDot.style.animation = "blink 1s infinite";
    statusDot.classList.add("offline"); // padrão

    const statusLabel = document.createElement("span");
    statusLabel.style.color = "#fff";
    statusLabel.style.fontSize = "12px";
    statusLabel.textContent = "Offline";

    statusDiv.appendChild(statusDot);
    statusDiv.appendChild(statusLabel);
    card.appendChild(statusDiv);

    // Banner
    const banner = document.createElement("div");
    banner.classList.add("banner");
    banner.style.backgroundImage = `url(${data.bannerURL || "https://via.placeholder.com/300x100"})`;
    card.appendChild(banner);

    // Avatar
    const avatar = document.createElement("img");
    avatar.classList.add("avatar");
    avatar.src = data.avatarURL || "https://via.placeholder.com/70";
    card.appendChild(avatar);

    // Nome
    const name = document.createElement("strong");
    name.textContent = data.displayName || "Usuário";
    card.appendChild(name);

    // Bio
    const bio = document.createElement("p");
    bio.textContent = data.bio || "";
    card.appendChild(bio);

    // Botão de música
    if (data.music) {
      const musicBtn = document.createElement("button");
      musicBtn.textContent = "▶️ Tocar música";
      musicBtn.style.marginBottom = "10px";
      musicBtn.addEventListener("click", () => {
        const audio = new Audio(`assets/${data.music}`);
        audio.play();
      });
      card.appendChild(musicBtn);
    }

    // Redes sociais
    const socials = document.createElement("div");
    socials.classList.add("socials");
    const socialLinks = {
      roblox: data.roblox,
      instagram: data.instagram,
      tiktok: data.tiktok,
      valorant: data.valorant,
      steam: data.steam,
      twitter: data.twitter,
      spotify: data.spotify
    };
    const icons = {
            roblox: "https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/0/e/e/0eeeb19633422b1241f4306419a0f15f39d58de9.png",
            instagram: "https://elementos.apresto.com.br/wp-content/uploads/2024/05/icon-Instagram-desenho.svg",
            tiktok: "https://cdn.worldvectorlogo.com/logos/tiktok-icon-2.svg",
            valorant: "https://www.svgrepo.com/show/424912/valorant-logo-play-2.svg",
            steam: "https://img.icons8.com/?size=50&id=pOa8st0SGd5C&format=png",
            twitter: "https://cdn.freelogovectors.net/wp-content/uploads/2023/07/x-logo-twitter-freelogovectors.net_.png",
            spotify: "https://upload.wikimedia.org/wikipedia/commons/a/a1/2024_Spotify_logo_without_text_(black).svg"
    };
    for (const [key, link] of Object.entries(socialLinks)) {
      if (link) {
        const a = document.createElement("a");
        a.href = link;
        a.target = "_blank";
        const img = document.createElement("img");
        img.src = icons[key];
        a.appendChild(img);
        socials.appendChild(a);
      }
    }
    card.appendChild(socials);

    // Escutando Realtime Database para status
    const statusRef = ref(rtdb, `status/${uid}`);
    onValue(statusRef, snap => {
      const val = snap.val();
      if (val && val.isOnline) {
        statusDot.style.backgroundColor = "#4caf50"; // verde
        statusLabel.textContent = "Online";
      } else {
        statusDot.style.backgroundColor = "#f44336"; // vermelho
        statusLabel.textContent = "Offline";
      }
    });

    profilesDiv.appendChild(card);
  });
});
