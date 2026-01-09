// dashboard-profile.js
import { auth, db, rtdb } from "./firebase.js"; // rtdb = Realtime Database
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref as rRef, set, onDisconnect } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Inputs de perfil
const nameInput = document.getElementById("nameInput");
const bioInput = document.getElementById("bioInput");
const avatarInput = document.getElementById("avatarInput");
const bannerInput = document.getElementById("bannerInput");
const colorInput = document.getElementById("colorInput");
const publicCheckbox = document.getElementById("publicCheckbox");

const robloxInput = document.getElementById("robloxInput");
const instagramInput = document.getElementById("instagramInput");
const tiktokInput = document.getElementById("tiktokInput");
const valorantInput = document.getElementById("valorantInput");
const steamInput = document.getElementById("steamInput");
const twitterInput = document.getElementById("twitterInput");
const spotifyInput = document.getElementById("spotifyInput");
const musicInput = document.getElementById("musicInput");

const saveBtn = document.getElementById("saveProfile");

// Botão de alternar ONLINE/OFFLINE
const toggleOnlineBtn = document.createElement("button");
toggleOnlineBtn.textContent = "🔴 Offline";
toggleOnlineBtn.style.marginBottom = "10px";
toggleOnlineBtn.style.padding = "10px 14px";
toggleOnlineBtn.style.border = "none";
toggleOnlineBtn.style.borderRadius = "6px";
toggleOnlineBtn.style.background = "#ff0000";
toggleOnlineBtn.style.color = "#fff";
toggleOnlineBtn.style.cursor = "pointer";
document.querySelector(".profile-form-container").prepend(toggleOnlineBtn);

let isOnline = false;
let userStatusRef;

// Carrega perfil existente e configura status online
auth.onAuthStateChanged(async user => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const profileRef = doc(db, "profiles", user.uid);
    const profileSnap = await getDoc(profileRef);

    // Realtime Database: referência do status
    userStatusRef = rRef(rtdb, `status/${user.uid}`);

    // Inicializa como ONLINE
    set(userStatusRef, true);
    isOnline = true;
    toggleOnlineBtn.textContent = "🟢 Online";
    toggleOnlineBtn.style.background = "#4caf50";

    // Configura para ir OFFLINE automaticamente ao desconectar
    onDisconnect(userStatusRef).set(false);

    if (profileSnap.exists()) {
        const data = profileSnap.data();
        nameInput.value = data.displayName || "";
        bioInput.value = data.bio || "";
        avatarInput.value = data.avatarURL || "";
        bannerInput.value = data.bannerURL || "";
        colorInput.value = data.color || "#5865f2";
        publicCheckbox.checked = data.public || false;

        robloxInput.value = data.roblox || "";
        instagramInput.value = data.instagram || "";
        tiktokInput.value = data.tiktok || "";
        valorantInput.value = data.valorant || "";
        steamInput.value = data.steam || "";
        twitterInput.value = data.twitter || "";
        spotifyInput.value = data.spotify || "";
        musicInput.value = data.music || "";
    }
});

// Alterna ONLINE/OFFLINE manualmente
toggleOnlineBtn.addEventListener("click", () => {
    isOnline = !isOnline;
    set(userStatusRef, isOnline);
    if (isOnline) {
        toggleOnlineBtn.textContent = "🟢 Online";
        toggleOnlineBtn.style.background = "#4caf50";
    } else {
        toggleOnlineBtn.textContent = "🔴 Offline";
        toggleOnlineBtn.style.background = "#ff0000";
    }
});

// Salvar perfil
saveBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return;

    await setDoc(doc(db, "profiles", user.uid), {
        displayName: nameInput.value || user.email.split("@")[0],
        bio: bioInput.value || "",
        avatarURL: avatarInput.value || "",
        bannerURL: bannerInput.value || "",
        color: colorInput.value || "#5865f2",
        public: publicCheckbox.checked,
        roblox: robloxInput.value || "",
        instagram: instagramInput.value || "",
        tiktok: tiktokInput.value || "",
        valorant: valorantInput.value || "",
        steam: steamInput.value || "",
        twitter: twitterInput.value || "",
        spotify: spotifyInput.value || "",
        music: musicInput.value || ""
    });

    alert("Perfil salvo!");
});
