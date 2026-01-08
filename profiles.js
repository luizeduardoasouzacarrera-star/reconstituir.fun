import { db } from "./firebase.js";
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const profilesDiv = document.getElementById("profiles");

const profilesRef = collection(db, "profiles");
const q = query(profilesRef, where("public", "==", true));

onSnapshot(q, snapshot => {
    profilesDiv.innerHTML = "";
    snapshot.forEach(doc => {
        const profile = doc.data();

        const card = document.createElement("div");
        card.className = "profile-card";
        card.style.setProperty("--profile-color", profile.color || "#141428");

        const banner = document.createElement("div");
        banner.className = "banner";
        banner.style.backgroundImage = `url(${profile.bannerURL || ""})`;
        card.appendChild(banner);

        const content = document.createElement("div");
        content.className = "profile-content";

        const avatar = document.createElement("img");
        avatar.className = "avatar";
        avatar.src = profile.avatarURL || "https://whitescreen.dev/images/pro/black-screen_39.png";

        const name = document.createElement("strong");
        name.textContent = profile.displayName || "Usuário";

        const bio = document.createElement("p");
        bio.textContent = profile.bio || "";

        content.appendChild(avatar);
        content.appendChild(name);
        content.appendChild(bio);

        card.appendChild(content);
        profilesDiv.appendChild(card);
    });
});
