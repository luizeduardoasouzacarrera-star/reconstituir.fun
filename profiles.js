import { db } from "./firebase.js";
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const profilesContainer = document.getElementById("profiles");

const profilesQuery = query(collection(db, "profiles"), where("public", "==", true));

onSnapshot(profilesQuery, snapshot => {
    profilesContainer.innerHTML = "";

    snapshot.forEach(docSnap => {
        const data = docSnap.data();

        const card = document.createElement("div");
        card.classList.add("profile-card");
        card.style.backgroundColor = data.color || "#141428";

        // Banner
        if (data.bannerURL) {
            const banner = document.createElement("div");
            banner.classList.add("banner");
            banner.style.backgroundImage = `url(${data.bannerURL})`;
            card.appendChild(banner);
        }

        // Avatar
        if (data.avatarURL) {
            const avatar = document.createElement("img");
            avatar.classList.add("avatar");
            avatar.src = data.avatarURL;
            card.appendChild(avatar);
        }

        // Nome
        const nameEl = document.createElement("strong");
        nameEl.textContent = data.displayName || "Usuário sem nome";
        card.appendChild(nameEl);

        // Bio
        if (data.bio) {
            const bioEl = document.createElement("p");
            bioEl.textContent = data.bio;
            card.appendChild(bioEl);
        }

        // Redes sociais
        const socialDiv = document.createElement("div");
        socialDiv.classList.add("socials");

        if (data.roblox) {
            const link = document.createElement("a");
            link.href = data.roblox;
            link.target = "_blank";
            link.innerHTML = '<img src="icons/roblox.svg" alt="Roblox">';
            socialDiv.appendChild(link);
        }
        if (data.instagram) {
            const link = document.createElement("a");
            link.href = data.instagram;
            link.target = "_blank";
            link.innerHTML = '<img src="icons/instagram.svg" alt="Instagram">';
            socialDiv.appendChild(link);
        }
        if (data.tiktok) {
            const link = document.createElement("a");
            link.href = data.tiktok;
            link.target = "_blank";
            link.innerHTML = '<img src="icons/tiktok.svg" alt="TikTok">';
            socialDiv.appendChild(link);
        }
        if (data.valorant) {
            const link = document.createElement("a");
            link.href = data.valorant;
            link.target = "_blank";
            link.innerHTML = '<img src="icons/valorant.svg" alt="Valorant">';
            socialDiv.appendChild(link);
        }
        if (data.steam) {
            const link = document.createElement("a");
            link.href = data.steam;
            link.target = "_blank";
            link.innerHTML = '<img src="icons/steam.svg" alt="Steam">';
            socialDiv.appendChild(link);
        }

        card.appendChild(socialDiv);
        profilesContainer.appendChild(card);
    });
});
