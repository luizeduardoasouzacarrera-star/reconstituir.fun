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

        // CARD PRINCIPAL (igual antes)
        const card = document.createElement("div");
        card.className = "profile-card";
        card.style.backgroundColor = data.color || "#5865f2";

        // Banner
        if (data.bannerURL) {
            const banner = document.createElement("img");
            banner.src = data.bannerURL;
            banner.className = "profile-banner";
            card.appendChild(banner);
        }

        // Avatar
        if (data.avatarURL) {
            const avatar = document.createElement("img");
            avatar.src = data.avatarURL;
            avatar.className = "profile-avatar";
            card.appendChild(avatar);
        }

        // Nome
        const name = document.createElement("h3");
        name.textContent = data.displayName || "Usuário";
        card.appendChild(name);

        // Bio (ÚNICA COISA NOVA: cor)
        if (data.bio) {
            const bio = document.createElement("p");
            bio.textContent = data.bio;
            bio.style.color = data.bioColor || "#ffffff";
            card.appendChild(bio);
        }

        profilesContainer.appendChild(card);
    });
}

loadProfiles();
