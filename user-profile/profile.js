import { db } from "../firebase.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { createProfileCard } from "../profile.js";

const container = document.getElementById("profile-single");

// pega ?user=luiz
const params = new URLSearchParams(window.location.search);
const username = params.get("user");

if (!username) {
  container.innerHTML = "<p>Perfil não encontrado.</p>";
  throw new Error("Username não informado");
}

// busca perfil pelo username
const q = query(
  collection(db, "profiles"),
  where("username", "==", username.toLowerCase())
);

const snap = await getDocs(q);

if (snap.empty) {
  container.innerHTML = "<p>Perfil não existe.</p>";
} else {
  snap.forEach(docSnap => {
    const data = docSnap.data();

    // 🔥 FORÇA exibir o perfil mesmo se não for público
    data.public = true;

    const result = createProfileCard(docSnap.id, data);
    if (result) {
      container.appendChild(result.card);
    }
  });
}
