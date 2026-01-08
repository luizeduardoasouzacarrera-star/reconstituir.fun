import { auth, db } from "./firebase.js";
import { doc, setDoc, onSnapshot, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ELEMENTOS
const nameInput = document.getElementById("nameInput");
const bioInput = document.getElementById("bioInput");
const avatarInput = document.getElementById("avatarInput");
const bannerInput = document.getElementById("bannerInput");
const colorInput = document.getElementById("colorInput");
const saveBtn = document.getElementById("saveProfile");
const profilesDiv = document.getElementById("profiles");

let currentUserId = "";

// FUNÇÃO PARA SALVAR OU ATUALIZAR PROFILE
async function saveProfile() {
    if (!currentUserId) return;

    const profileData = {
        displayName: nameInput.value || "Usuário sem nome",
        bio: bioInput.value || "",
        avatarURL: avatarInput.value || "https://via.placeholder.com/60",
        bannerURL: bannerInput.value || "https://via.placeholder.com/280x80",
        color: colorInput.value || "#4da6ff"
    };

    await setDoc(doc(db, "profiles", currentUserId), profileData);
    alert("Perfil atualizado!");
}

// FUNÇÃO PARA GERAR CARDS DE PROFILE
function renderProfiles(snapshot) {
    profilesDiv.innerHTML = "";

    snapshot.forEach(docSnap => {
        const data = docSnap.data();

        const card = document.createElement("div");
        card.classList.add("profile-card");

        card.innerHTML = `
            <div class="banner" style="background-image: url('${data.bannerURL || "https://via.placeholder.com/280x80"}')"></div>
            <div class="info">
                <img class="avatar" src="${data.avatarURL || "https://via.placeholder.com/60"}" alt="Avatar">
                <div class="displayName">${data.displayName || "Usuário sem nome"}</div>
                <div class="bio">${data.bio || ""}</div>
            </div>
            <div class="bottom-bar" style="background-color: ${data.color || "#4da6ff"}"></div>
        `;

        profilesDiv.appendChild(card);
    });
}

// MONITORA LOGIN
auth.onAuthStateChanged(user => {
    if (!user) return;

    currentUserId = user.email.split("@")[0]; // ID do documento é o username

    const profileRef = doc(db, "profiles", currentUserId);
    onSnapshot(profileRef, docSnap => {
        if (!docSnap.exists()) return;

        const data = docSnap.data();
        nameInput.value = data.displayName || "";
        bioInput.value = data.bio || "";
        avatarInput.value = data.avatarURL || "";
        bannerInput.value = data.bannerURL || "";
        colorInput.value = data.color || "#4da6ff";
    });
});

// ESCUTA TODOS OS PROFILES
onSnapshot(collection(db, "profiles"), renderProfiles);

// BOTÃO SALVAR
saveBtn.addEventListener("click", saveProfile);
