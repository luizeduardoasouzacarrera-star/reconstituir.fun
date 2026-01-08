import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db, auth } from "./firebase.js";

// Carrega o perfil do usuário
export async function loadUserProfile(user) {
    const ref = doc(db, "profiles", user.uid);
    const snap = await getDoc(ref);

    // Se o perfil não existir, cria um novo
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

    // Recarrega os dados atualizados
    const updatedSnap = await getDoc(ref);
    return updatedSnap.data();
}

// Atualiza o perfil do usuário
export async function updateProfile(data) {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "profiles", user.uid);
    await updateDoc(ref, data);
}
