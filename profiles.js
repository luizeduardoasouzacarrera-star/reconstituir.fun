import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db, auth } from "./firebase.js";

// Função para carregar o perfil do usuário
export async function loadUserProfile(user) {
    const ref = doc(db, "profiles", user.uid);
    const snap = await getDoc(ref);

    // Cria o perfil se não existir
    if (!snap.exists()) {
        await setDoc(ref, {
            username: user.email.split("@")[0],
            displayName: user.email.split("@")[0],
            bio: "",
            avatarURL: "",
            bannerURL: "",
            createdAt: serverTimestamp()
        });
    }

    // Retorna os dados atualizados
    const updatedSnap = await getDoc(ref);
    return updatedSnap.data();
}

// Função para atualizar o perfil do usuário
export async function updateProfile(data) {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "profiles", user.uid);
    await updateDoc(ref, data);
}
