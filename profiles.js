// profiles.js
import { auth, db } from "./firebase.js";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const profilesContainer = document.getElementById("profiles");

let isLuiz = false;

// 🔐 Detecta se é o Luiz
auth.onAuthStateChanged(user => {
  if (user) {
    const username = user.email.split("@")[0];
    isLuiz = username === "luiz";
  }
});

const socialIcons = {
  roblox: "https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/4X/0/e/e/0eeeb19633422b1241f4306419a0f15f39d58de9.png",
  instagram: "https://elementos.apresto.com.br/wp-content/uploads/2024/05/icon-Instagram-desenho.svg",
  tiktok: "https://cdn.worldvectorlogo.com/logos/tiktok-icon-2.svg",
  valorant: "https://www.svgrepo.com/show/424912/valorant-logo-play-2.svg",
  steam: "https://img.icons8.com/?size=50&id=pOa8st0SGd5C&format=png",
  twitter: "https://cdn.freelogovectors.net/wp-content/uploads/2023/07/x-logo-twitter-freelogovectors.net_.png",
  spotify: "https://upload.wikimedia.org/wikipedia/commons/a/a1/2024_Spotify_logo_without_text_%28black%29.svg"
};

function createProfileCard(userId, data) {
  const card = document.createElement("div");
  card.classList.add("profile-card");

  card.style.setProperty("--profile-color", data.color || "#5865f2");

  const banner = document.createElement("div");
  banner.classList.add("banner");
  banner.style.backgroundImage = `url('${data.bannerURL || ""}')`;
  card.appendChild(banner);

  const avatar = document.createElement("img");
  avatar.classList.add("avatar");
  avatar.src = data.avatarURL || "";
  card.appendChild(avatar);

  const nameEl = document.createElement("strong");
  nameEl.textContent = data.displayName || userId;
  card.appendChild(nameEl);

  if (data.bio) {
    const bioEl = document.createElement("p");
    bioEl.textContent = data.bio;
    bioEl.style.color = data.bioColor || "#ffffff";
    card.appendChild(bioEl);
  }

  const socialsDiv = document.createElement("div");
  socialsDiv.classList.add("socials");

  Object.keys(socialIcons).forEach(key => {
    if (data[key]) {
      const a = document.createElement("a");
      a.href = data[key];
      a.target = "_blank";
      const img = document.createElement("img");
      img.src = socialIcons[key];
      a.appendChild(img);
      socialsDiv.appendChild(a);
    }
  });

  card.appendChild(socialsDiv);

  // 🔥 PODER DE ADMIN (SÓ LUIZ)
  if (isLuiz && data.public === true) {
    card.style.cursor = "pointer";
    card.title = "Clique para remover perfil público";

    card.addEventListener("click", async () => {
      const confirmHide = confirm(
        `Remover o perfil de ${data.displayName || "usuário"} do público?`
      );

      if (confirmHide) {
        await updateDoc(doc(db, "profiles", userId), {
          public: false
        });
      }
    });
  }

  profilesContainer.appendChild(card);
}

// 🔄 REALTIME
onSnapshot(collection(db, "profiles"), snapshot => {
  profilesContainer.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    if (data.public === true) {
      createProfileCard(docSnap.id, data);
    }
  });
});
