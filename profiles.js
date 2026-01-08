import { db } from "./firebase.js";
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const profilesContainer = document.getElementById("profiles");

// Função para criar cards
function createProfileCard(data, id) {
    const card = document.createElement("div");
    card.className = "profile-card";
    card.dataset.uid = id;
    card.style.setProperty("--profile-color", data.color || "#5865f2");

    // Banner
    const banner = document.createElement("div");
    banner.className = "banner";
    banner.style.backgroundImage = `url(${data.bannerURL || ""})`;

    // Conteúdo do card
    const content = document.createElement("div");
    content.className = "profile-content";

    const avatar = document.createElement("img");
    avatar.className = "avatar";
    avatar.src = data.avatarURL || "";

    const name = document.createElement("strong");
    name.className = "profile-name";
    name.textContent = data.displayName || "Usuário";

    const bio = document.createElement("p");
    bio.className = "profile-bio";
    bio.textContent = data.bio || "";

    content.appendChild(avatar);
    content.appendChild(name);
    content.appendChild(bio);

    card.appendChild(banner);
    card.appendChild(content);

    return card;
}

// Observa todos os perfis públicos
const q = query(collection(db, "profiles"), where("public", "==", true));

onSnapshot(q, snapshot => {
    profilesContainer.innerHTML = "";
    snapshot.forEach(doc => {
        const data = doc.data();
        const card = createProfileCard(data, doc.id);
        profilesContainer.appendChild(card);
    });
});
