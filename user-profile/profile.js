import { db } from "../firebase.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { createProfileCard } from "../profile.js";

const container = document.getElementById("profile-single");

const params = new URLSearchParams(window.location.search);
const username = params.get("user");

if (!username) {
  container.innerHTML = "<p>Perfil não encontrado.</p>";
} else {
  const q = query(
    collection(db, "profiles"),
    where("username", "==", username.toLowerCase())
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    container.innerHTML = "<p>Perfil não existe.</p>";
  } else {
    snap.forEach(docSnap => {
      const result = createProfileCard(docSnap.id, docSnap.data());
      if (result) container.appendChild(result.card);
    });
  }
}
