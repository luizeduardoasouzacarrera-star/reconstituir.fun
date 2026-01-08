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

// ===== ELEMENTOS =====
const chatDiv = document.getElementById("chat");
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("message");
const logoutBtn = document.getElementById("logoutBtn");

let username = "";
let isLuiz = false;

// ===== AUTH =====
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
    text: text,
    timestamp: serverTimestamp()
  });

  messageInput.value = "";
}

// ===== LISTAR =====
const q = query(
  collection(db, "messages"),
  orderBy("timestamp", "asc")
);

onSnapshot(q, snapshot => {
  chatDiv.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const id = docSnap.id;

    const time = data.timestamp
      ? new Date(data.timestamp.seconds * 1000).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit"
        })
      : "";

    const p = document.createElement("p");

    p.innerHTML = `<b>${data.user}</b> (${time}): ${data.text}`;

    // 👉 APAGAR MSG (SÓ LUIZ)
    if (isLuiz) {
      p.style.cursor = "pointer";
      p.title = "Clique para apagar";

      p.addEventListener("click", async () => {
        const confirmDelete = confirm("Apagar esta mensagem?");
        if (confirmDelete) {
          await deleteDoc(doc(db, "messages", id));
        }
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
