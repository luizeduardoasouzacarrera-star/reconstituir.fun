// profiles.js
import { db } from "./firebase.js";
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const profilesContainer = document.getElementById("profiles");

const profilesQuery = query(collection(db, "profiles"), where("public", "==", true));

const socialIcons = {
  roblox: "https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/0/e/e/0eeeb19633422b1241f4306419a0f15f39d58de9.png",
  instagram: "https://elementos.apresto.com.br/wp-content/uploads/2024/05/icon-Instagram-desenho.svg",
  tiktok: "https://cdn.worldvectorlogo.com/logos/tiktok-icon-2.svg",
  valorant: "https://www.svgrepo.com/show/424912/valorant-logo-play-2.svg",
  steam: "https://img.icons8.com/?size=50&id=pOa8st0SGd5C&format=png",
  spotify: "https://upload.wikimedia.org/wikipedia/commons/a/a1/2024_Spotify_logo_without_text_%28black%29.svg",
  twitter: "https://i.pinimg.com/736x/69/a6/2a/69a62a5edc08d755dd8a4ef017e14c63.jpg"
};

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

    for (const key of ["roblox","instagram","tiktok","valorant","steam","spotify","twitter"]) {
      if (data[key]) {
        const link = document.createElement("a");
        link.href = data[key];
        link.target = "_blank";

        const img = document.createElement("img");
        img.src = socialIcons[key];
        img.alt = key;
        link.appendChild(img);

        socialDiv.appendChild(link);
      }
    }

    card.appendChild(socialDiv);
    profilesContainer.appendChild(card);
  });
});
