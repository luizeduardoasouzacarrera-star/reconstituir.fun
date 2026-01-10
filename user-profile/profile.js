import { db } from "../firebase.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { createProfileCard } from "../profiles.js";

const container = document.getElementById("profile-single");

const params = new URLSearchParams(window.location.search);
const username = params.get("user");

if (!username) {
  container.innerHTML = "<p>Perfil não encontrado.</p>";
  throw new Error("User não informado");
}

// normaliza
const name = username.toLowerCase();

// 🔥 BUSCA PELO DISPLAY NAME
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

    // força renderização
    data.public = true;

    const result = createProfileCard(docSnap.id, data);
    if (result) container.appendChild(result.card);
  });
}
