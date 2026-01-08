import { auth } from "./firebase.js";
import { signInWithEmailAndPassword }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const msg = document.getElementById("msg");

document.getElementById("loginBtn").addEventListener("click", login);

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    msg.innerText = "❌ Preencha nome e senha";
    return;
  }

  const emailFake = `${username.toLowerCase()}@reconstituir.fun`;

  signInWithEmailAndPassword(auth, emailFake, password)
    .then(() => {
      msg.innerText = "✅ Login realizado com sucesso";
    })
    .catch(() => {
      msg.innerText = "❌ Nome ou senha inválidos";
    });
}
