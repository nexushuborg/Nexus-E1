document.getElementById("loginBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "authWithGitHub" }, (response) => {
        const out = document.getElementById("output");
        if (response?.jwt) {
            out.innerHTML = `
                <p>Welcome, ${response.username}!</p>
                <img src="${response.avatarUrl}" width="50" style="border-radius:50%">
            `;
        } else {
            out.textContent = "Login failed!";
        }
    });
});

async function showUser() {
    const { username, avatarUrl } = await chrome.storage.local.get(["username", "avatarUrl"]);

    const out = document.getElementById("output");

    if (username) {
        out.innerHTML = `
      <p>Welcome, ${username}!</p>
      <img src="${avatarUrl}" width="50" style="border-radius:50%">
    `;
    } else {
        out.textContent = "Not logged in.";
    }
}

showUser();

document.getElementById("logoutBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "logout" }, (response) => {
        document.getElementById("output").textContent = response.success
            ? "Logged out!"
            : "Logout failed!";
    });
});