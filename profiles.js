import { db } from "./firebase.js";
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const profilesContainer = document.getElementById("profiles");

// URLs de ícones públicos (PNG/SVG)
const socialIcons = {
  roblox: "https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/0/e/e/0eeeb19633422b1241f4306419a0f15f39d58de9.png",
  instagram: "https://tse3.mm.bing.net/th/id/OIP.zIajNTOFBjzFWyZ1Jh-H2AHaHa?cb=defcachec2&rs=1&pid=ImgDetMain&o=7&rm=3",
  tiktok: "https://w7.pngwing.com/pngs/959/454/png-transparent-tiktok-logo-thumbnail.png",
  valorant: "https://images.icon-icons.com/3660/PNG/512/valorant_logo_play_riot_games_icon_228477.png",
  steam: "https://img.icons8.com/?size=50&id=pOa8st0SGd5C&format=png"
};

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

    // Para cada rede verificamos se existe no doc
    for (const key of Object.keys(socialIcons)) {
      if (data[key]) {
        const link = document.createElement("a");
        link.href = data[key];
        link.target = "_blank";
        link.innerHTML = `<img src="${socialIcons[key]}" alt="${key}" style="width:24px;height:24px;">`;
        socialDiv.appendChild(link);
      }
    }

    card.appendChild(socialDiv);
    profilesContainer.appendChild(card);
  });
});
