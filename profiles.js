import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, getDocs, query } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth } from "./firebase.js";

// 🔹 Lista de nomes autorizados a criar profiles (sem o @example.com)
const allowedUsers = ["luiz", "admin"]; 

// Carrega profile do usuário, cria se não existir e usuário for autorizado
export async function loadUserProfile(user) {
  if (!user) return null;

  const ref = doc(db, "profiles", user.uid);
  const snap = await getDoc(ref);

  const username = user.email.split("@")[0];

  // Cria profile se não existir e usuário for permitido
  if (!snap.exists() && allowedUsers.includes(username)) {
    await setDoc(ref, {
      username: username,
      displayName: username,
      bio: "",
      avatarURL: "",
      bannerURL: "",
      createdAt: serverTimestamp()
    });
  }

  const updatedSnap = await getDoc(ref);
  return updatedSnap.exists() ? updatedSnap.data() : null;
}

// Atualiza profile do usuário
export async function updateProfile(data) {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "profiles", user.uid);
  await updateDoc(ref, data);
}

// Lista todos os profiles para mostrar no grid
export async function loadAllProfiles() {
  const q = query(collection(db, "profiles"));
  const snapshot = await getDocs(q);

  const profiles = [];
  snapshot.forEach(docSnap => {
    profiles.push({ id: docSnap.id, ...docSnap.data() });
  });

  return profiles;
}
