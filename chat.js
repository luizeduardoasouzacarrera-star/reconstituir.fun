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

const chatDiv = document.getElementById("chat");
const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("message");
const logoutBtn = document.getElementById("logoutBtn");

let username = "";

// 🔒 BLOQUEIO TOTAL SEM LOGIN
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.replace("index.html");
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

  snapshot.forEach(docc => {
    const d = docc.data();

    // ⏰ FORMATAR HORÁRIO
    let hora = "";
    if (d.timestamp && d.timestamp.toDate) {
      hora = d.timestamp.toDate().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
      });
    }

    // 🗑️ BOTÃO APAGAR (SÓ PARA LUIZ)
    let deleteBtn = "";
    if (username === "luiz") {
      deleteBtn = `<button data-id="${docc.id}">Apagar</button>`;
    }

    chatDiv.innerHTML +=
      `<p>
        <b>${d.user}</b> [${hora}]: ${d.text}
        ${deleteBtn}
      </p>`;
  });

  chatDiv.scrollTop = chatDiv.scrollHeight;

  // 🗑️ EVENTO APAGAR
  const buttons = document.querySelectorAll("button[data-id]");
  buttons.forEach(btn => {
    btn.onclick = async () => {
      const id = btn.getAttribute("data-id");
      await deleteDoc(doc(db, "messages", id));
    };
  });
});

// 🚪 LOGOUT
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.replace("index.html");
  });
});
