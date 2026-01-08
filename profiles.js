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

        const socials = [
            { key: "roblox", icon: "fa-roblox" },
            { key: "instagram", icon: "fa-brands fa-instagram" },
            { key: "tiktok", icon: "fa-brands fa-tiktok" },
            { key: "valorant", icon: "fa-solid fa-crosshairs" },
            { key: "steam", icon: "fa-brands fa-steam" }
        ];

        socials.forEach(social => {
            if (data[social.key]) {
                const link = document.createElement("a");
                link.href = data[social.key];
                link.target = "_blank";
                link.innerHTML = `<i class="${social.icon}"></i>`;
                socialDiv.appendChild(link);
            }
        });

        card.appendChild(socialDiv);
        profilesContainer.appendChild(card);
    });
});
