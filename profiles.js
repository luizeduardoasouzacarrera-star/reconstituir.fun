import { db, rtdb } from "./firebase.js";
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const profilesContainer = document.getElementById("profiles");

const profilesQuery = query(collection(db, "profiles"), where("public", "==", true));

onSnapshot(profilesQuery, snapshot => {
    profilesContainer.innerHTML = "";

    snapshot.forEach(docSnap => {
        const data = docSnap.data();
        const userId = docSnap.id;

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

        // Status Online/Offline
        const statusEl = document.createElement("p");
        statusEl.style.fontWeight = "bold";
        card.appendChild(statusEl);

        const statusRef = ref(rtdb, 'status/' + userId);
        onValue(statusRef, snap => {
            const status = snap.val();
            if(status?.isOnline) {
                statusEl.innerHTML = '<span class="online-dot"></span> ONLINE';
            } else {
                statusEl.innerHTML = '<span class="offline-dot"></span> OFFLINE';
            }
        });

        // Bio
        if (data.bio) {
            const bioEl = document.createElement("p");
            bioEl.textContent = data.bio;
            card.appendChild(bioEl);
        }

        // Redes sociais
        const socialDiv = document.createElement("div");
        socialDiv.classList.add("socials");

        const icons = {
            roblox: "https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/0/e/e/0eeeb19633422b1241f4306419a0f15f39d58de9.png",
            instagram: "https://elementos.apresto.com.br/wp-content/uploads/2024/05/icon-Instagram-desenho.svg",
            tiktok: "https://cdn.worldvectorlogo.com/logos/tiktok-icon-2.svg",
            valorant: "https://www.svgrepo.com/show/424912/valorant-logo-play-2.svg",
            steam: "https://img.icons8.com/?size=50&id=pOa8st0SGd5C&format=png",
            twitter: "https://img.freepik.com/free-vector/new-twitter-logo-x-icon-black-background_1017-45427.jpg",
            spotify: "https://upload.wikimedia.org/wikipedia/commons/a/a1/2024_Spotify_logo_without_text_%28black%29.svg"
        };

        for (let key in icons) {
            if(data[key]) {
                const link = document.createElement("a");
                link.href = data[key];
                link.target = "_blank";
                link.innerHTML = `<img src="${icons[key]}" alt="${key}">`;
                socialDiv.appendChild(link);
            }
        }

        card.appendChild(socialDiv);

        // Botão de música
        if(data.music) {
            const musicBtn = document.createElement("button");
            musicBtn.classList.add("play-music-btn");
            musicBtn.dataset.music = data.music;
            musicBtn.textContent = "▶️ Tocar Música";
            musicBtn.addEventListener("click", () => {
                const music = new Audio(`assets/${musicBtn.dataset.music}`);
                music.play();
            });
            card.appendChild(musicBtn);
        }

        profilesContainer.appendChild(card);
    });
});
