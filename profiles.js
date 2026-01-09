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

    // Só mostrar se público
    if (!data.public) return;

    // Criar card
    const card = document.createElement("div");
    card.classList.add("profile-card");
    card.style.borderColor = data.color || "#5865f2"; // COR PERSONALIZADA

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
    for (const [key, link] of Object.entries(socialLinks)) {
      if (link) {
        const a = document.createElement("a");
        a.href = link;
        a.target = "_blank";
        const img = document.createElement("img");
        // URLs das imagens
        const icons = {
            roblox: "https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/0/e/e/0eeeb19633422b1241f4306419a0f15f39d58de9.png",
            instagram: "https://elementos.apresto.com.br/wp-content/uploads/2024/05/icon-Instagram-desenho.svg",
            tiktok: "https://cdn.worldvectorlogo.com/logos/tiktok-icon-2.svg",
            valorant: "https://www.svgrepo.com/show/424912/valorant-logo-play-2.svg",
            steam: "https://img.icons8.com/?size=50&id=pOa8st0SGd5C&format=png",
            twitter: "https://cdn.freelogovectors.net/wp-content/uploads/2023/07/x-logo-twitter-freelogovectors.net_.png",
            spotify: "https://upload.wikimedia.org/wikipedia/commons/a/a1/2024_Spotify_logo_without_text_(black).svg"
        };
        img.src = icons[key];
        a.appendChild(img);
        socials.appendChild(a);
      }
    }
    card.appendChild(socials);

    // Status (Online/Offline)
    const status = document.createElement("div");
    status.classList.add("status-indicator");
    const dot = document.createElement("span");
    dot.classList.add("status-bubble");
    const label = document.createElement("span");
    label.textContent = "Offline";

    status.appendChild(dot);
    status.appendChild(label);
    card.appendChild(status);

    // Escutando Realtime Database para status
    const statusRef = ref(rtdb, `status/${uid}`);
    onValue(statusRef, snap => {
      const val = snap.val();
      if (val && val.isOnline) {
        dot.classList.remove("offline");
        dot.classList.add("online");
        label.textContent = "Online";
      } else {
        dot.classList.remove("online");
        dot.classList.add("offline");
        label.textContent = "Offline";
      }
    });

    profilesDiv.appendChild(card);
  });
});
