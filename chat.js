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

// 🔒 PROTEÇÃO DE LOGIN
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

// 📥 RECEBER MENSAGENS
const q = query(collection(db, "messages"), orderBy("timestamp"));
onSnapshot(q, snapshot => {
  chatDiv.innerHTML = "";

  snapshot.forEach(docSnap => {
    const d = docSnap.data();
    const id = docSnap.id;

    // 👑 LÍDER
    let displayName = d.user === "luiz"
      ? "👑 " + d.user
      : d.user;

    // ⏰ HORÁRIO
    let time = "";
    if (d.timestamp) {
      time = new Date(d.timestamp.seconds * 1000)
        .toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit"
        });
    }

    // 🗑 BOTÃO APAGAR (SÓ PARA LUIZ)
    let deleteBtn = "";
    if (username === "luiz") {
      deleteBtn = `
        <button
          data-id="${id}"
          style="
            margin-left:8px;
            background:none;
            border:none;
            color:#ff6b6b;
            cursor:pointer;
            font-size:12px;
          "
        >
          apagar
        </button>
      `;
    }

    chatDiv.innerHTML += `
      <p>
        <b>${displayName}</b>
        <span style="color:gray;font-size:12px">(${time})</span>:
        ${d.text}
        ${deleteBtn}
      </p>
    `;
  });

  chatDiv.scrollTop = chatDiv.scrollHeight;
});

// 🗑 EVENTO DE APAGAR (DELEGAÇÃO)
chatDiv.addEventListener("click", async (e) => {
  if (e.target.tagName === "BUTTON" && e.target.dataset.id) {
    const id = e.target.dataset.id;

    if (username === "luiz") {
      await deleteDoc(doc(db, "messages", id));
    }
  }
});

// 🚪 LOGOUT
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.replace("index.html");
  });
});
