import { auth, db } from "./firebase.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("sendBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  let currentUser = null;

  // 🔒 Bloqueio de acesso
  onAuthStateChanged(auth, user => {
    if (!user) {
      window.location.href = "index.html";
    } else {
      currentUser = user.email.split("@")[0]; // pega o “nome” do email
    }
  });

  // Enviar mensagem
  sendBtn.addEventListener("click", async () => {
    const text = chatInput.value.trim();
    if (!text) return;
    await addDoc(collection(db, "messages"), {
      user: currentUser,
      text,
      timestamp: serverTimestamp()
    });
    chatInput.value = "";
  });

  // Atualizar chat em tempo real
  const q = query(collection(db, "messages"), orderBy("timestamp"));
  onSnapshot(q, snapshot => {
    chatBox.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.classList.add("msg");
      if (data.user === currentUser) div.classList.add("me");
      div.innerText = `${data.user}: ${data.text}`;
      chatBox.appendChild(div);
      chatBox.scrollTop = chatBox.scrollHeight;
    });
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.href = "index.html";
    });
  });
});
