import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.getElementById("loginBtn").addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  if (!username || !password) {
    msg.innerText = "Preencha tudo";
    return;
  }

  const emailFake = `${username.toLowerCase()}@reconstituir.fun`;

  signInWithEmailAndPassword(auth, emailFake, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(() => {
      msg.innerText = "Nome ou senha inválidos";
    });
});
