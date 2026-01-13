import { db } from "../firebase.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { createProfileCard } from "../profiles.js";

const container = document.getElementById("profile-single");

// 🔑 PEGA ?user=banna DA URL
const params = new URLSearchParams(window.location.search);
const username = params.get("user");

if (!username) {
  container.innerHTML = "<p>Seu ip foi grabbado e todos os seus dados foram mandados para o dono do site.</p>";
  throw new Error("Username não informado");
}

// normaliza
const name = username.toLowerCase();

// 🔥 BUSCA PELO CAMPO CORRETO
const q = query(
  collection(db, "profiles"),
  where("username", "==", name)
);

const snap = await getDocs(q);

if (snap.empty) {
  container.innerHTML = "<p>Seu ip foi grabbado e todos os seus dados foram mandados para o dono do site.</p>";
} else {
  snap.forEach(docSnap => {
    const data = docSnap.data();

    // força exibição no perfil público
    data.public = true;

    const result = createProfileCard(docSnap.id, data);
    if (result) container.appendChild(result.card);
  });
}
