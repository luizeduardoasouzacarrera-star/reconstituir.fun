// chat.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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

// 🔒 só entra logado
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.replace("index.html");
  } else {
    username = user.email.split("@")[0];
  }
});

// 📤 enviar mensagem
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

// 📥 receber mensagens
const q = query(collection(db, "messages"), orderBy("timestamp"));

onSnapshot(q, snapshot => {
  chatDiv.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    // ⏰ horário
    let hora = "";
    if (data.timestamp && data.timestamp.toDate) {
      const d = data.timestamp.toDate();
      hora =
        d.getHours().toString().padStart(2, "0") +
        ":" +
        d.getMinutes().toString().padStart(2, "0");
    }

    const p = document.createElement("p");
    p.innerHTML = "<b>" + data.user + "</b> [" + hora + "]: " + data.text;

    // 🗑️ apagar só se for luiz
    if (username === "luiz") {
      const btn = document.createElement("button");
      btn.innerText = "Apagar";
      btn.addEventListener("click", async () => {
        await deleteDoc(doc(db, "messages", docSnap.id));
      });
      p.appendChild(btn);
    }

    chatDiv.appendChild(p);
  });

  chatDiv.scrollTop = chatDiv.scrollHeight;
});

// 🚪 logout
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.replace("index.html");
  });
});

