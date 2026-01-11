import { auth, db } from "./firebase.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Elementos
const nameInput = document.getElementById("nameInput");
const bioInput = document.getElementById("bioInput");
const avatarInput = document.getElementById("avatarInput");
const bannerInput = document.getElementById("bannerInput");
const publicCheckbox = document.getElementById("publicCheckbox");
const saveBtn = document.getElementById("saveProfile");

// Verifica login
auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const username = user.email.split("@")[0];
  const ref = doc(db, "profiles", username);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    nameInput.value = data.displayName || username;
    bioInput.value = data.bio || "";
    avatarInput.value = data.avatarURL || "";
    bannerInput.value = data.bannerURL || "";
    publicCheckbox.checked = data.public || false;
  }
});

// Salvar perfil
saveBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const username = user.email.split("@")[0];

  await setDoc(
    doc(db, "profiles", username),
    {
      username,
      displayName: nameInput.value || username,
      bio: bioInput.value || "",
      avatarURL: avatarInput.value || "",
      bannerURL: bannerInput.value || "",
      public: publicCheckbox.checked
    },
    { merge: true }
  );

  alert("Perfil salvo!");
});
