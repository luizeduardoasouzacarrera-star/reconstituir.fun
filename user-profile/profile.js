import { db } from "../firebase.js";
import { doc, getDoc } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { createProfileCard } from "../profiles.js";

const container = document.getElementById("profile-single");

// pega UID da URL
const params = new URLSearchParams(window.location.search);
const uid = params.get("uid");

if (!uid) {
  container.innerHTML = "<p>Perfil não encontrado.</p>";
} else {
  const ref = doc(db, "profiles", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    container.innerHTML = "<p>Perfil não existe.</p>";
  } else {
    const result = createProfileCard(uid, snap.data());
    if (result) container.appendChild(result.card);
  }
}
