import { auth, db } from "./firebase.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Elementos do HTML
const nameInput = document.getElementById("nameInput");
const bioInput = document.getElementById("bioInput");
const avatarInput = document.getElementById("avatarInput");
const bannerInput = document.getElementById("bannerInput");
const publicCheckbox = document.getElementById("publicCheckbox");
const saveBtn = document.getElementById("saveProfile");

// Checa login do usuário
auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const profileRef = doc(db, "profiles", user.uid);
  const profileSnap = await getDoc(profileRef);

  // Se já existe perfil, preenche os campos
  if (profileSnap.exists()) {
    const data = profileSnap.data();
    nameInput.value = data.displayName || "";
    bioInput.value = data.bio || "";
    avatarInput.value = data.avatarURL || "";
    bannerInput.value = data.bannerURL || "";
    publicCheckbox.checked = data.public || false;
  }
});

// Salvar/atualizar perfil
saveBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  await setDoc(doc(db, "profiles", user.uid), {
    username: user.email.split("@")[0],
    displayName: nameInput.value || user.email.split("@")[0],
    bio: bioInput.value || "",
    avatarURL: avatarInput.value || "",
    bannerURL: bannerInput.value || "",
    public: publicCheckbox.checked
  });

  alert("Perfil salvo!");
});
