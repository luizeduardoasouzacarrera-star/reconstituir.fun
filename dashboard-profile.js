import { auth, db } from "./firebase.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Elementos do formulário
const nameInput = document.getElementById("nameInput");
const bioInput = document.getElementById("bioInput");
const avatarInput = document.getElementById("avatarInput");
const bannerInput = document.getElementById("bannerInput");
const colorInput = document.getElementById("colorInput"); // novo campo para cor
const publicCheckbox = document.getElementById("publicCheckbox");
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
        colorInput.value = data.color || "#5865f2"; // cor padrão
        publicCheckbox.checked = data.public || false;
    }
});

// Salvar perfil
saveBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return;

    const colorValue = colorInput.value || "#5865f2";

    await setDoc(doc(db, "profiles", user.uid), {
        username: user.email.split("@")[0],
        displayName: nameInput.value || user.email.split("@")[0],
        bio: bioInput.value || "",
        avatarURL: avatarInput.value || "",
        bannerURL: bannerInput.value || "",
        color: colorValue,
        public: publicCheckbox.checked
    });

    // Atualiza o card imediatamente se já existir
    const ownCard = document.querySelector(`.profile-card[data-uid="${user.uid}"]`);
    if (ownCard) {
        ownCard.style.setProperty("--profile-color", colorValue);
        ownCard.querySelector(".profile-name").textContent = nameInput.value || user.email.split("@")[0];
        ownCard.querySelector(".profile-bio").textContent = bioInput.value || "";
        ownCard.querySelector(".avatar").src = avatarInput.value || "";
        ownCard.querySelector(".banner").style.backgroundImage = `url(${bannerInput.value || ""})`;
    }

    alert("Perfil salvo!");
});
