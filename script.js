// script.js
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const msg = document.getElementById("msg");

  loginBtn.addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
      msg.innerText = "❌ Preencha nome e senha";
      return;
    }

    const emailFake = `${username.toLowerCase()}@reconstituir.fun`;

    signInWithEmailAndPassword(auth, emailFake, password)
      .then(() => {
        // 🔥 REDIRECIONA PARA OUTRA PÁGINA
        window.location.href = "dashboard.html";
      })
      .catch(() => {
        msg.innerText = "❌ Nome ou senha inválidos";
      });
  });
});
