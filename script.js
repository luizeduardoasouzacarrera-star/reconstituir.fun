import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const msg = document.getElementById("msg");

document.getElementById("loginBtn").addEventListener("click", login);
document.getElementById("registerBtn").addEventListener("click", register);

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      msg.innerText = "✅ Login realizado com sucesso";
    })
    .catch(error => {
      msg.innerText = "❌ " + error.message;
    });
}

function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      msg.innerText = "✅ Cadastro realizado com sucesso";
    })
    .catch(error => {
      msg.innerText = "❌ " + error.message;
    });
}
