// dashboard-profile.js
import { auth, db } from "./firebase.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Inputs
const nameInput = document.getElementById("nameInput");
const bioInput = document.getElementById("bioInput");
const bioColorInput = document.getElementById("bioColorInput");
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
const musicBtnColorInput = document.getElementById("musicBtnColorInput");

const saveBtn = document.getElementById("saveProfile");

// Carregar perfil
auth.onAuthStateChanged(async user => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const ref = doc(db, "profiles", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
        const data = snap.data();

        nameInput.value = data.displayName || "";
        bioInput.value = data.bio || "";
        bioColorInput.value = data.bioColor || "#cccccc";
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
        musicBtnColorInput.value = data.musicBtnColor || "#1db954";
    }
});

// Salvar perfil
saveBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return;

    await setDoc(doc(db, "profiles", user.uid), {
        displayName: nameInput.value || user.email.split("@")[0],
        bio: bioInput.value || "",
        bioColor: bioColorInput.value || "#cccccc",
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

        music: musicInput.value || "",
        musicBtnColor: musicBtnColorInput.value || "#1db954"
    });

    alert("Perfil salvo!");
});
