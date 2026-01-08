import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { auth, db } from "./firebase.js";
import { loadUserProfile } from "./profiles.js";

// ELEMENTOS
const chat = document.getElementById("chat");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

// ===== ENVIAR MENSAGEM =====
sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const user = auth.currentUser;
  if (!user) return;

  const text = msgInput.value.trim();
  if (text === "") return;

  const profile = await loadUserProfile(user);

  await addDoc(collection(db, "messages"), {
    uid: user.uid,
    text: text,
    displayName: profile.displayName,
    createdAt: serverTimestamp()
  });

  msgInput.value = "";
}

// ===== LISTEN MENSAGENS =====
const q = query(
  collection(db, "messages"),
  orderBy("createdAt", "asc")
);

onSnapshot(q, (snapshot) => {
  chat.innerHTML = "";

  snapshot.forEach((doc) => {
    const m = doc.data();

    chat.innerHTML += `
      <p>
        <b>${m.displayName}:</b> ${m.text}
      </p>
    `;
  });

  chat.scrollTop = chat.scrollHeight;
});
