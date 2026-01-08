// script.js
import { auth } from "./firebase.js";
import { loadUserProfile, loadAllProfiles } from "./profiles.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ===== ELEMENTOS =====
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const msgSpan = document.getElementById("msg");
const profilesDiv = document.getElementById("profiles");

// ===== LOGIN =====
loginBtn.addEventListener("click", async () => {
  const email = usernameInput.value;
  const password = passwordInput.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    msgSpan.textContent = "Erro no login: " + err.message;
  }
});

// ===== LOGOUT E AUTENTICAÇÃO =====
onAuthStateChanged(auth, async user => {
  if (!user) {
    // não logado
    profilesDiv.innerHTML = "";
    return;
  }

  // Carregar profile do usuário atual
  const profile = await loadUserProfile(user);

  if (!profile) {
    profilesDiv.innerHTML = "<p>Você não tem permissão para criar profile.</p>";
  } else {
    displayProfiles(await loadAllProfiles(), user.uid);
  }
});

// ===== EXIBIR TODOS OS PROFILES =====
function displayProfiles(profiles, currentUid) {
  profilesDiv.innerHTML = "";

  profiles.forEach(p => {
    const card = document.createElement("div");
    card.className = "profile-card";

    const name = document.createElement("strong");
    name.textContent = p.displayName;

    const bio = document.createElement("p");
    bio.textContent = p.bio;

    const avatar = document.createElement("img");
    avatar.src = p.avatarURL || "https://via.placeholder.com/100";
    avatar.style.width = "100px";
    avatar.style.height = "100px";
    avatar.style.borderRadius = "50%";
    avatar.style.objectFit = "cover";

    card.appendChild(avatar);
    card.appendChild(name);
    card.appendChild(bio);

    // Se for o próprio profile, permitir editar
    if (p.id === currentUid) {
      const editBtn = document.createElement("button");
      editBtn.textContent = "Editar";
      editBtn.onclick = () => {
        // redireciona para página de edição de profile
        window.location.href = "perfil.html";
      };
      card.appendChild(editBtn);
    }

    profilesDiv.appendChild(card);
  });
}
