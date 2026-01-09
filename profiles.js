import { auth, db } from "./firebase.js";
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const profilesDiv = document.getElementById("profiles");

const socialIcons = {
            roblox: "https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/0/e/e/0eeeb19633422b1241f4306419a0f15f39d58de9.png",
            instagram: "https://elementos.apresto.com.br/wp-content/uploads/2024/05/icon-Instagram-desenho.svg",
            tiktok: "https://cdn.worldvectorlogo.com/logos/tiktok-icon-2.svg",
            valorant: "https://www.svgrepo.com/show/424912/valorant-logo-play-2.svg",
            steam: "https://img.icons8.com/?size=50&id=pOa8st0SGd5C&format=png",
            twitter: "https://img.freepik.com/free-vector/new-twitter-logo-x-icon-black-background_1017-45427.jpg",
            spotify: "https://upload.wikimedia.org/wikipedia/commons/a/a1/2024_Spotify_logo_without_text_(black).svg"
};

// Mostrar perfis públicos
const profilesQuery = query(collection(db, "profiles"), orderBy("displayName"));
onSnapshot(profilesQuery, snapshot => {
    profilesDiv.innerHTML = "";

    snapshot.forEach(docSnap => {
        const profile = docSnap.data();

        if (!profile.public) return;

        const card = document.createElement("div");
        card.className = "profile-card";
        card.style.backgroundColor = profile.color || "#141428";

        // Banner
        const banner = document.createElement("div");
        banner.className = "banner";
        banner.style.backgroundImage = `url(${profile.bannerURL || ""})`;
        card.appendChild(banner);

        // Avatar
        const avatar = document.createElement("img");
        avatar.className = "avatar";
        avatar.src = profile.avatarURL || "";
        card.appendChild(avatar);

        // Status
        const statusDiv = document.createElement("div");
        statusDiv.className = "status-indicator";
        const statusDot = document.createElement("span");
        statusDot.className = profile.isOnline ? "online-dot" : "offline-dot";
        const statusText = document.createElement("span");
        statusText.textContent = profile.isOnline ? "ONLINE" : "OFFLINE";
        statusDiv.appendChild(statusDot);
        statusDiv.appendChild(statusText);
        card.appendChild(statusDiv);

        // Nome e Bio
        const name = document.createElement("strong");
        name.textContent = profile.displayName || "";
        card.appendChild(name);

        const bio = document.createElement("p");
        bio.textContent = profile.bio || "";
        card.appendChild(bio);

        // Redes sociais
        const socialsDiv = document.createElement("div");
        socialsDiv.className = "socials";

        for (let key in socialIcons) {
            if (profile[key]) {
                const a = document.createElement("a");
                a.href = profile[key];
                a.target = "_blank";
                const img = document.createElement("img");
                img.src = socialIcons[key];
                a.appendChild(img);
                socialsDiv.appendChild(a);
            }
        }

        card.appendChild(socialsDiv);
        profilesDiv.appendChild(card);
    });
});
