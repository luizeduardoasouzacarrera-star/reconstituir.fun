import { auth, rtdb, ref, set, onDisconnect } from "./firebase.js";

auth.onAuthStateChanged(user => {
    if (user) {
        const statusRef = ref(rtdb, `status/${user.uid}`);

        // Coloca como online
        set(statusRef, { isOnline: false });

        // Quando desconectar, vira offline
        onDisconnect(statusRef).set({ isOnline: true });
    }
});
