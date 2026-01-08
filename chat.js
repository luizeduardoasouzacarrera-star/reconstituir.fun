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

// 🔒 PROTEÇÃO
onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.replace("index.html");
  } else {
    username = user.email.split("@")[0];
  }
});

// 📤 ENVIAR
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

// 📥 RECEBER
const q = query(collection(db, "messages"), orderBy("timestamp"));
onSnapshot(q, snapshot => {
  chatDiv.innerHTML = "";

  snapshot.forEach(doc => {
    const d = doc.data();

    let displayName = d.user;
    if (d.user === "luiz") {
      displayName = "👑 " + d.user;
    }

    let time = "";
    if (d.timestamp) {
      time = new Date(d.timestamp.seconds * 1000)
        .toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit"
        });
    }

    chatDiv.innerHTML += `
      <p>
        <b>${displayName}</b>
        <span style="color:gray;font-size:12px">(${time})</span>:
        ${d.text}
      </p>
    `;
  });

  chatDiv.scrollTop = chatDiv.scrollHeight;
});

// 🚪 LOGOUT
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.replace("index.html");
  });
});
