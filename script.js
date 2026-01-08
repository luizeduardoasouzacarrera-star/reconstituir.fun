// script.js
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Garantir que o HTML já carregou
document.addEventListener("DOMContentLoaded", () => {

  const msg = document.getElementById("msg");
  const loginBtn = document.getElementById("loginBtn");

  loginBtn.addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
      msg.innerText = "❌ Preencha nome e senha";
      return;
    }

    // Converte o nome em um "email fake" para o Firebase
    const emailFake = `${username.toLowerCase()}@reconstituir.fun`;

    signInWithEmailAndPassword(auth, emailFake, password)
      .then(() => {
        // 🔥 REDIRECIONA PARA A TELA DE SUCESSO
        window.location.href = "dashboard.html";
      })
      .catch(() => {
        msg.innerText = "❌ Nome ou senha inválidos";
      });
  });

});
