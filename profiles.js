// profiles.js
import { db } from "./firebase.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Pega o elemento onde os perfis serão exibidos
const profiles = document.getElementById("profiles");

// Observa a coleção "profiles" do Firestore e atualiza a tela sempre que mudar
onSnapshot(collection(db, "profiles"), snapshot => {
  profiles.innerHTML = ""; // limpa antes de adicionar

  snapshot.forEach(doc => {
    const data = doc.data();

    // Cria um card de perfil simples
    profiles.innerHTML += `
      <div class="profile-card">
        <strong>${data.displayName || data.username || "Usuário sem nome"}</strong>
        ${data.bio ? `<p>${data.bio}</p>` : ""}
        ${data.avatarURL ? `<img src="${data.avatarURL}" alt="Avatar" style="width:50px;height:50px;border-radius:50%;">` : ""}
      </div>
    `;
  });
});
