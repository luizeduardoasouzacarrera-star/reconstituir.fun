import { db } from "../firebase.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { createProfileCard } from "../profiles.js";

const container = document.getElementById("profile-single");

// 🔥 pega o nome direto da URL: /user-profile/banna
const pathParts = window.location.pathname.split("/");
const username = pathParts[pathParts.length - 1];

if (!username || username === "user-profile") {
  container.innerHTML = "<p>Perfil não encontrado.</p>";
  throw new Error("Username não informado");
}

const name = username.toLowerCase();

// busca pelo displayName
const q = query(
  collection(db, "profiles"),
  where("displayName", "==", name)
);

const snap = await getDocs(q);

if (snap.empty) {
  container.innerHTML = "<p>Perfil não existe.</p>";
} else {
  snap.forEach(docSnap => {
    const data = docSnap.data();

    // força renderização no perfil único
    data.public = true;

    const result = createProfileCard(docSnap.id, data);
    if (result) container.appendChild(result.card);
  });
}
