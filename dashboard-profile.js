// dashboard-profile.js
import { auth, db, rtdb } from "./firebase.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref as rRef, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Inputs do perfil
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

// ===== NOVO: BOTÃO ONLINE/OFFLINE =====
const toggleStatusBtn = document.createElement("button");
toggleStatusBtn.id = "toggleStatusBtn";
toggleStatusBtn.style.marginTop = "10px";
toggleStatusBtn.style.padding = "8px 14px";
toggleStatusBtn.style.border = "none";
toggleStatusBtn.style.borderRadius = "6px";
toggleStatusBtn.style.background = "#5865f2";
toggleStatusBtn.style.color = "#fff";
toggleStatusBtn.style.cursor = "pointer";
toggleStatusBtn.textContent = "🔴 OFFLINE";

document.querySelector(".profile-form-container").appendChild(toggleStatusBtn);

let currentStatus = false; // false = offline, true = online
let userStatusRef; // referência no Realtime Database

// Carrega perfil existente
auth.onAuthStateChanged(async user => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    userStatusRef = rRef(rtdb, `status/${user.uid}`);

    const profileRef = doc(db, "profiles", user.uid);
    const profileSnap = await getDoc(profileRef);

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

    // Pega status atual do Realtime Database e atualiza botão
    const snapshot = await get(userStatusRef);
    currentStatus = snapshot.val() || false;
    updateStatusButton();
});

// Função para atualizar texto e cor do botão
function updateStatusButton() {
    if (currentStatus) {
        toggleStatusBtn.textContent = "🟢 ONLINE";
        toggleStatusBtn.style.background = "#4caf50";
    } else {
        toggleStatusBtn.textContent = "🔴 OFFLINE";
        toggleStatusBtn.style.background = "#5865f2";
    }
}

// Clicar no botão alterna status
toggleStatusBtn.addEventListener("click", async () => {
    currentStatus = !currentStatus;
    updateStatusButton();
    if (userStatusRef) {
        await set(userStatusRef, currentStatus);
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
