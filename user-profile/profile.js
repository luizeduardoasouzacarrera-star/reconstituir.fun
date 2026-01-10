import { db } from "../firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { createProfileCard } from "../profiles.js";

const container = document.getElementById("profileContainer");

// pega ?id=UID
const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

if (!userId) {
  container.innerHTML = "<p>Perfil não encontrado.</p>";
} else {
  const ref = doc(db, "profiles", userId);
  const snap = await getDoc(ref);

  if (!snap.exists() || !snap.data().public) {
    container.innerHTML = "<p>Perfil privado ou inexistente.</p>";
  } else {
    const result = createProfileCard(userId, snap.data());
    if (result) container.appendChild(result.card);
  }
}
