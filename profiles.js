// profiles.js
import { db, rtdb } from "./firebase.js"; // db = Firestore, rtdb = Realtime Database
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref as rtdbRef, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ===== ELEMENTO PRINCIPAL =====
const profilesContainer = document.getElementById("profiles");

// URLs de ícones de redes sociais
const socialIcons = {
            roblox: "https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/0/e/e/0eeeb19633422b1241f4306419a0f15f39d58de9.png",
            instagram: "https://elementos.apresto.com.br/wp-content/uploads/2024/05/icon-Instagram-desenho.svg",
            tiktok: "https://cdn.worldvectorlogo.com/logos/tiktok-icon-2.svg",
            valorant: "https://www.svgrepo.com/show/424912/valorant-logo-play-2.svg",
            steam: "https://img.icons8.com/?size=50&id=pOa8st0SGd5C&format=png",
            twitter: "https://cdn.freelogovectors.net/wp-content/uploads/2023/07/x-logo-twitter-freelogovectors.net_.png",
            spotify: "https://upload.wikimedia.org/wikipedia/commons/a/a1/2024_Spotify_logo_without_text_(black).svg"
};

// ===== FUNÇÃO PRINCIPAL =====
export async function loadPublicProfiles() {
    profilesContainer.innerHTML = ""; // limpa antes de carregar

    // Pega todos os perfis públicos do Firestore
    const profilesCol = collection(db, "profiles");
    const q = query(profilesCol, where("public", "==", true));
    const snapshot = await getDocs(q);

    snapshot.forEach(docSnap => {
        const data = docSnap.data();

        // Cria card do perfil
        const card = document.createElement("div");
        card.className = "profile-card";
        card.style.borderColor = data.color || "#5865f2"; // cor do perfil

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

        // Nome e bio
        const nameEl = document.createElement("strong");
        nameEl.textContent = data.displayName || "Usuário";
        card.appendChild(nameEl);

        const bioEl = document.createElement("p");
        bioEl.textContent = data.bio || "";
        card.appendChild(bioEl);

        // Socials
        const socialsDiv = document.createElement("div");
        socialsDiv.className = "socials";
        for (const key of Object.keys(socialIcons)) {
            if (data[key]) {
                const a = document.createElement("a");
                a.href = data[key];
                a.target = "_blank";
                const img = document.createElement("img");
                img.src = socialIcons[key];
                a.appendChild(img);
                socialsDiv.appendChild(a);
            }
        }
        card.appendChild(socialsDiv);

        // Música
        if (data.music) {
            const playBtn = document.createElement("button");
            playBtn.textContent = "▶ Tocar música";
            playBtn.style.marginTop = "10px";
            playBtn.onclick = () => {
                const audio = new Audio(`assets/${data.music}`);
                audio.play();
            };
            card.appendChild(playBtn);
        }

        // Status online/offline
        const statusDiv = document.createElement("div");
        statusDiv.className = "status-indicator";
        statusDiv.style.position = "absolute";
        statusDiv.style.top = "10px";
        statusDiv.style.left = "10px";
        card.appendChild(statusDiv);

        const statusBubble = document.createElement("span");
        statusBubble.className = "status-bubble offline";
        statusDiv.appendChild(statusBubble);

        const statusText = document.createElement("span");
        statusText.textContent = "OFFLINE";
        statusDiv.appendChild(statusText);

        // ===== Realtime Database para online/offline =====
        const rtdbUserRef = rtdbRef(rtdb, `onlineUsers/${docSnap.id}`);
        onValue(rtdbUserRef, snapshot => {
            const isOnline = snapshot.val() === true;
            statusBubble.className = "status-bubble " + (isOnline ? "online" : "offline");
            statusText.textContent = isOnline ? "ONLINE" : "OFFLINE";
        });

        profilesContainer.appendChild(card);
    });
}

// Chama a função ao carregar
loadPublicProfiles();
