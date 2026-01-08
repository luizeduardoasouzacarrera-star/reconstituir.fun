import { auth, db } from "./firebase.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Elementos do formulário
const nameInput = document.getElementById("nameInput");
const bioInput = document.getElementById("bioInput");
const avatarInput = document.getElementById("avatarInput");
const bannerInput = document.getElementById("bannerInput");
const colorInput = document.getElementById("colorInput"); // campo de cor
const publicCheckbox = document.getElementById("publicCheckbox");

// Novas redes sociais
const robloxInput = document.getElementById("robloxInput");
const instagramInput = document.getElementById("instagramInput");
const tiktokInput = document.getElementById("tiktokInput");
const valorantInput = document.getElementById("valorantInput");
const steamInput = document.getElementById("steamInput");

const saveBtn = document.getElementById("saveProfile");

auth.onAuthStateChanged(async user => {
    if (!user) {
        window.location.href = "index.html";
        return;
    }

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
        steam: steamInput.value || ""
    });

    alert("Perfil salvo!");
});
