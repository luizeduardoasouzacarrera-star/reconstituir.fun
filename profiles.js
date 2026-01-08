import { db } from "./firebase.js";
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const profilesDiv = document.getElementById("profiles");

function renderProfiles(profiles) {
    profilesDiv.innerHTML = "";

    profiles.forEach(profile => {
        const card = document.createElement("div");
        card.classList.add("profile-card");
        card.style.backgroundColor = profile.color || "#141428";

        // Banner
        const banner = document.createElement("div");
        banner.classList.add("banner");
        if(profile.bannerURL) banner.style.backgroundImage = `url(${profile.bannerURL})`;
        card.appendChild(banner);

        // Avatar
        const avatar = document.createElement("img");
        avatar.classList.add("avatar");
        if(profile.avatarURL) avatar.src = profile.avatarURL;
        else avatar.src = "https://whitescreen.dev/images/pro/black-screen_39.png";
        card.appendChild(avatar);

        // Info
        const info = document.createElement("div");
        info.classList.add("profile-info");

        const name = document.createElement("strong");
        name.textContent = profile.displayName || "Usuário";
        info.appendChild(name);

        if(profile.bio) {
            const bio = document.createElement("p");
            bio.textContent = profile.bio;
            info.appendChild(bio);
        }

        // Redes sociais
        const socialDiv = document.createElement("div");
        socialDiv.classList.add("social-links");

        const socialIcons = {
            roblox: "fab fa-roblox",
            instagram: "fab fa-instagram",
            tiktok: "fab fa-tiktok",
            valorant: "fas fa-crosshairs",
            steam: "fab fa-steam"
        };

        for(const [key, iconClass] of Object.entries(socialIcons)) {
            if(profile[key]) {
                const a = document.createElement("a");
                a.href = profile[key];
                a.target = "_blank";
                const i = document.createElement("i");
                i.className = iconClass;
                a.appendChild(i);
                socialDiv.appendChild(a);
            }
        }

        info.appendChild(socialDiv);
        card.appendChild(info);

        profilesDiv.appendChild(card);
    });
}

// Carregar perfis públicos
const q = query(collection(db, "profiles"), where("public", "==", true));
onSnapshot(q, snapshot => {
    const profiles = snapshot.docs.map(doc => doc.data());
    renderProfiles(profiles);
});
