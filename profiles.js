// profiles.js
import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  getDocs,
  query,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Lista de emails autorizados a criar profiles
const allowedUsers = ["luiz@example.com", "admin@example.com"]; // 🔹 coloque os emails autorizados aqui

// ===== CARREGAR PROFILE =====
export async function loadUserProfile(user) {
  if (!user) return null;

  const ref = doc(db, "profiles", user.uid);
  const snap = await getDoc(ref);

  // Se não existe profile, cria apenas se usuário autorizado
  if (!snap.exists() && allowedUsers.includes(user.email)) {
    await setDoc(ref, {
      username: user.email.split("@")[0],
      displayName: user.email.split("@")[0],
      bio: "",
      avatarURL: "",
      bannerURL: "",
      createdAt: serverTimestamp()
    });
  }

  const updatedSnap = await getDoc(ref);
  return updatedSnap.exists() ? updatedSnap.data() : null;
}

// ===== ATUALIZAR PROFILE =====
export async function updateProfile(data) {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "profiles", user.uid);
  await updateDoc(ref, data);
}

// ===== LISTAR TODOS OS PROFILES =====
export async function loadAllProfiles() {
  const q = query(collection(db, "profiles"));
  const snapshot = await getDocs(q);

  const profiles = [];
  snapshot.forEach(docSnap => {
    profiles.push({ id: docSnap.id, ...docSnap.data() });
  });

  return profiles;
}
