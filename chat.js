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
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const chatDiv = document.getElementById("chat");
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("message");
const logoutBtn = document.getElementById("logoutBtn");

let username = "";

// 🔒 BLOQUEIO TOTAL SEM LOGIN
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.replace("index.html"); // NÃO deixa entrar
  } else {
    username = user.email.split("@")[0];
  }
});

// 📤 ENVIAR MENSAGEM
sendBtn.addEventListener("click", async () => {
  const text = messageInput.value.trim();
  if (!text) return;

  await addDoc(collection(db, "messages"), {
    user: username,
    text: text,
    timestamp: serverTimestamp()
  });

  messageInput.value = "";
});

// 📥 RECEBER MENSAGENS EM TEMPO REAL
const q = query(collection(db, "messages"), orderBy("timestamp"));
onSnapshot(q, snapshot => {
  chatDiv.innerHTML = "";
  snapshot.forEach(doc => {
    const d = doc.data();
    chatDiv.innerHTML += `<p><b>${d.user}:</b> ${d.text}</p>`;
  });
  chatDiv.scrollTop = chatDiv.scrollHeight;
});

// 🚪 LOGOUT
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.replace("index.html");
  });
});
