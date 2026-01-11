import { db } from "../firebase.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { createProfileCard } from "../profiles.js";

const container = document.getElementById("profile-single");

// pega ?user=banna
const params = new URLSearchParams(window.location.search);
const username = params.get("user");

if (!username) {
  container.innerHTML = "<p>Perfil não encontrado.</p>";
  throw new Error("Username não informado");
}

const ref = doc(db, "profiles", username.toLowerCase());
const snap = await getDoc(ref);

if (!snap.exists()) {
  container.innerHTML = "<p>Perfil não existe.</p>";
} else {
  const data = snap.data();

  // força público no perfil individual
  data.public = true;

  const result = createProfileCard(username, data);
  if (result) container.appendChild(result.card);
}
