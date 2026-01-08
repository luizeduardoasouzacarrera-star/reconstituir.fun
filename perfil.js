import { updateProfile } from "./profiles.js";

document.getElementById("saveProfile").onclick = async () => {
    const displayName = document.getElementById("displayNameInput").value;
    const bio = document.getElementById("bioInput").value;
    const avatarURL = document.getElementById("avatarInput").value;
    const bannerURL = document.getElementById("bannerInput").value;

    await updateProfile({ displayName, bio, avatarURL, bannerURL });
    alert("Perfil atualizado!");
};
