import { updateProfile } from "./profiles.js";

document.getElementById("saveProfile").onclick = async () => {
  await updateProfile({
    displayName: document.getElementById("nameInput").value,
    bio: document.getElementById("bioInput").value,
    avatarURL: document.getElementById("avatarInput").value,
    bannerURL: document.getElementById("bannerInput").value
  });

  alert("Perfil atualizado!");
};
