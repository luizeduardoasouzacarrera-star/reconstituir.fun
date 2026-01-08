// chat.js
import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ELEMENTOS
const chatDiv = document.getElementById("chat");
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("message");
const logoutBtn = document.getElementById("logoutBtn");

let username = "";
let isLuiz = false;

// ===== LOGIN CHECK =====
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.replace("index.html");
    return;
  }

  username = user.email.split("@")[0];
  isLuiz = username === "luiz";
});

// ===== ENVIAR =====
sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  await addDoc(collection(db, "messages"), {
    user: username,
    text,
    timestamp: serverTimestamp()
  });

  messageInput.value = "";
}

// ===== LISTENER =====
const q = query(
  collection(db, "messages"),
  orderBy("timestamp", "asc")
);

onSnapshot(q, snapshot => {
  chatDiv.innerHTML = "";

  snapshot.forEach(d => {
    const data = d.data();
    const id = d.id;

    const time = data.timestamp
      ? new Date(data.timestamp.seconds * 1000).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit"
        })
      : "";

    const crown = data.user === "luiz" ? " 👑" : "";

    const p = document.createElement("p");
    p.innerHTML = `<b>${data.user}${crown}</b> (${time}): ${data.text}`;

    // botão invisível visualmente (não quebra layout)
    if (isLuiz) {
      p.addEventListener("dblclick", async () => {
        await deleteDoc(doc(db, "messages", id));
      });
    }

    chatDiv.appendChild(p);
  });

  chatDiv.scrollTop = chatDiv.scrollHeight;
});

// ===== LOGOUT =====
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.replace("index.html");
  });
});
