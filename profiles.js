import { db, rtdb, ref, onValue } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const profilesDiv = document.getElementById("profiles");

// Carrega todos os perfis públicos
async function loadProfiles() {
    profilesDiv.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "profiles"));
    querySnapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.public) {
            const card = createProfileCard(data, docSnap.id);
            profilesDiv.appendChild(card);
        }
    });
}

function createProfileCard(data, uid) {
    const card = document.createElement("div");
    card.className = "profile-card";

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
    const name = document.createElement("strong");
    name.textContent = data.displayName || "";
    card.appendChild(name);

    // Bio
    const bio = document.createElement("p");
    bio.textContent = data.bio || "";
    card.appendChild(bio);

    // Status online/offline
    const statusIndicator = document.createElement("div");
    statusIndicator.className = "status-indicator";
    statusIndicator.style.position = "absolute";
    statusIndicator.style.top = "10px";
    statusIndicator.style.left = "10px";
    statusIndicator.style.display = "flex";
    statusIndicator.style.alignItems = "center";
    statusIndicator.style.gap = "5px";
    statusIndicator.style.fontSize = "12px";
    statusIndicator.style.fontWeight = "bold";

    const statusDot = document.createElement("span");
    statusDot.className = "online-dot"; // assume online
    const statusText = document.createElement("span");
    statusText.textContent = "Online";

    statusIndicator.appendChild(statusDot);
    statusIndicator.appendChild(statusText);
    card.appendChild(statusIndicator);

    // Escuta Realtime Database para status
    const statusRef = ref(rtdb, `status/${uid}`);
    onValue(statusRef, snapshot => {
        const status = snapshot.val();
        if (status?.isOnline) {
            statusDot.className = "online-dot";
            statusText.textContent = "Online";
        } else {
            statusDot.className = "offline-dot";
            statusText.textContent = "Offline";
        }
    });

    // Redes sociais
    const socialsDiv = document.createElement("div");
    socialsDiv.className = "socials";

    const socialLinks = {
        roblox: data.roblox,
        instagram: data.instagram,
        tiktok: data.tiktok,
        valorant: data.valorant,
        steam: data.steam,
        twitter: data.twitter,
        spotify: data.spotify
    };

    for (let key in socialLinks) {
        if (socialLinks[key]) {
            const a = document.createElement("a");
            a.href = socialLinks[key];
            a.target = "_blank";
            const img = document.createElement("img");
            img.src = getSocialIcon(key);
            a.appendChild(img);
            socialsDiv.appendChild(a);
        }
    }
    card.appendChild(socialsDiv);

    // Botão de música
    if (data.music) {
        const audio = document.createElement("audio");
        audio.src = `assets/${data.music}`;
        audio.preload = "auto";

        const btn = document.createElement("button");
        btn.textContent = "▶️ Ouvir música";
        btn.style.marginTop = "10px";
        btn.style.background = "#1DB954";
        btn.style.color = "#fff";
        btn.style.border = "none";
        btn.style.padding = "8px 16px";
        btn.style.borderRadius = "6px";
        btn.style.cursor = "pointer";

        btn.addEventListener("click", () => {
            if (audio.paused) audio.play();
            else audio.pause();
        });

        card.appendChild(btn);
    }

    return card;
}

function getSocialIcon(name) {
    const icons = {
            roblox: "https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/0/e/e/0eeeb19633422b1241f4306419a0f15f39d58de9.png",
            instagram: "https://elementos.apresto.com.br/wp-content/uploads/2024/05/icon-Instagram-desenho.svg",
            tiktok: "https://cdn.worldvectorlogo.com/logos/tiktok-icon-2.svg",
            valorant: "https://www.svgrepo.com/show/424912/valorant-logo-play-2.svg",
            steam: "https://img.icons8.com/?size=50&id=pOa8st0SGd5C&format=png",
            twitter: "https://img.freepik.com/free-vector/new-twitter-logo-x-icon-black-background_1017-45427.jpg",
            spotify: "https://upload.wikimedia.org/wikipedia/commons/a/a1/2024_Spotify_logo_without_text_(black).svg"
    };
    return icons[name];
}

// Carrega todos os perfis
loadProfiles();
