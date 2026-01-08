// script.js
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");
const msg = document.getElementById("msg");

loginBtn.addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
 
  if (!username || !password) {
    msg.innerText = "Preencha tudo";
    return;
  }

  const emailFake = `${username.toLowerCase()}@reconstituir.fun`;

  try {
    await signInWithEmailAndPassword(auth, emailFake, password);
    window.location.href = "dashboard.html";
  } catch (err) {
    msg.innerText = "Nome ou senha inválidos";
  }
});
