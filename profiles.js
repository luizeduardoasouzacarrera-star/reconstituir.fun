import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const profilesContainer = document.getElementById("profiles");

async function loadProfiles() {
    profilesContainer.innerHTML = "";

    const q = query(
        collection(db, "profiles"),
        where("public", "==", true)
    );

    const snapshot = await getDocs(q);

    snapshot.forEach(docSnap => {
        const data = docSnap.data();

        const card = document.createElement("div");
        card.className = "profile-card";

        // ===== BANNER =====
        if (data.bannerURL) {
            const banner = document.createElement("div");
            banner.className = "profile-banner";
            banner.style.backgroundImage = `url(${data.bannerURL})`;
            card.appendChild(banner);
        }

        // ===== CONTEÚDO =====
        const content = document.createElement("div");
        content.className = "profile-content";
        content.style.backgroundColor = data.color || "#5865f2";

        // Avatar
        if (data.avatarURL) {
            const avatar = document.createElement("img");
            avatar.src = data.avatarURL;
            avatar.className = "profile-avatar";
            content.appendChild(avatar);
        }

        // Nome
        const name = document.createElement("h3");
        name.textContent = data.displayName || "Usuário";
        content.appendChild(name);

        // Bio (COM COR PERSONALIZADA)
        if (data.bio) {
            const bio = document.createElement("p");
            bio.textContent = data.bio;
            bio.style.color = data.bioColor || "#ffffff";
            content.appendChild(bio);
        }

        card.appendChild(content);
        profilesContainer.appendChild(card);
    });
}

loadProfiles();
