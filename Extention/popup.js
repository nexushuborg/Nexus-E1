document.getElementById("loginBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "authWithGitHub" }, (response) => {
        const out = document.getElementById("output");
        if (response?.jwt) {
            showUser();
            // out.innerHTML = `
            //     <p>Welcome, ${response.username}!</p>
            //     <img src="${response.avatarUrl}" width="50" style="border-radius:50%">
            // `;
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

async function checkRepoStatus() {
    chrome.runtime.sendMessage({ action: "getRepoConfig" }, (response) => {
        const repoStatusDiv = document.getElementById("repoStatus");
        const repoUrlInput = document.getElementById("repoUrl");
        const linkBtn = document.getElementById("linkBtn");

        if (response.success && response.config && response.config.connected) {
            // Repository is connected
            const config = response.config;
            repoStatusDiv.innerHTML = `
                <div style="color: green; margin-bottom: 10px; padding: 8px; border: 1px solid #4CAF50; border-radius: 4px; background-color: #f0f8f0;">
                    ✅ Connected to: <strong>${config.owner}/${config.repo}</strong>
                    <br><small>Connected on: ${new Date(config.connectedAt).toLocaleDateString()}</small>
                    <br><button id="dynamicDisconnectBtn" style="margin-top: 5px; padding: 3px 8px; background-color: #ff4444; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">Disconnect</button>
                </div>
            `;

            // Add event listener to the dynamically created disconnect button
            const dynamicDisconnectBtn = document.getElementById("dynamicDisconnectBtn");
            if (dynamicDisconnectBtn) {
                dynamicDisconnectBtn.addEventListener("click", () => {
                    if (confirm("Are you sure you want to disconnect the current repository?")) {
                        chrome.storage.local.remove(['repoConfig'], () => {
                            showSuccess("Repository disconnected successfully!");
                            checkRepoStatus(); // Refresh the status display
                        });
                    }
                });
            }

            repoUrlInput.style.display = "none";
            linkBtn.style.display = "none";
        } else {
            // No repository connected
            repoStatusDiv.innerHTML = `
                <div style="color: orange; margin-bottom: 10px; padding: 8px; border: 1px solid #ff9800; border-radius: 4px; background-color: #fff8e1;">
                    ⚠️ No repository linked. Please connect a repository to auto-save solutions.
                </div>
            `;
            repoUrlInput.style.display = "block";
            linkBtn.style.display = "block";
        }
    });
}

showUser();

document.getElementById("logoutBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "logout" }, (response) => {
        document.getElementById("output").textContent = response.success
            ? "Logged out!"
            : "Logout failed!";
    });
});

// UI based on authentication and repo status
document.addEventListener("DOMContentLoaded", async () => {
    const { username } = await chrome.storage.local.get(["username"]);

    if (username) {
        // User is logged in
        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("logoutBtn").style.display = "block";
        document.getElementById("repoSection").style.display = "block";

        await showUser();
        await checkRepoStatus();
    } else {
        // User is not logged in
        document.getElementById("loginBtn").style.display = "block";
        document.getElementById("logoutBtn").style.display = "none";
        document.getElementById("repoSection").style.display = "none";
        await showUser();
    }
});

// Listen for messages from background script
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "showRepoLink") {
//         // Show repo section after successful authentication
//         document.getElementById("repoSection").style.display = "block";
//         checkRepoStatus();
//     }
// });

// REPOSITORY LINKING
document.getElementById("linkBtn").addEventListener("click", async () => {
    const repoUrl = document.getElementById("repoUrl").value.trim();
    const linkBtn = document.getElementById("linkBtn");
    const statusDiv = document.getElementById("repoStatus");

    // Validate GitHub URL format
    if (!repoUrl.startsWith("https://github.com/")) {
        showError("Please enter a valid GitHub repository URL (https://github.com/owner/repo)");
        return;
    }

    // Parse owner and repo from URL
    const urlPath = repoUrl.replace("https://github.com/", "").replace(/\/$/, "");
    const parts = urlPath.split("/");

    if (parts.length < 2 || !parts[0] || !parts[1]) {
        showError("Invalid repository URL format. Expected: https://github.com/owner/repo");
        return;
    }

    const owner = parts[0];
    const repo = parts[1];

    // Show loading state
    linkBtn.disabled = true;
    linkBtn.textContent = "Connecting...";
    statusDiv.innerHTML = '<div style="color: blue;">🔄 Validating repository...</div>';

    try {
        // First validate the repository
        chrome.runtime.sendMessage(
            {
                action: "validateRepository",
                owner: owner,
                repo: repo
            },
            (response) => {
                if (response.success) {
                    // Repository is valid, now connect it
                    statusDiv.innerHTML = '<div style="color: blue;">🔄 Setting up directory structure...</div>';

                    chrome.runtime.sendMessage(
                        {
                            action: "connectRepository",
                            owner: owner,
                            repo: repo
                        },
                        (connectResponse) => {
                            linkBtn.disabled = false;
                            linkBtn.textContent = "Link Repository";

                            if (connectResponse.success) {
                                showSuccess(`Repository ${owner}/${repo} linked successfully!`);
                                checkRepoStatus(); // Refresh the status display
                                document.getElementById("repoUrl").value = ""; // Clear input
                            } else {
                                showError(`Failed to connect repository: ${connectResponse.error}`);
                            }
                        }
                    );
                } else {
                    // Repository validation failed
                    linkBtn.disabled = false;
                    linkBtn.textContent = "Link Repository";
                    showError(`Repository validation failed: ${response.error}`);
                }
            }
        );
    } catch (error) {
        linkBtn.disabled = false;
        linkBtn.textContent = "Link Repository";
        showError(`Connection error: ${error.message}`);
    }
});

// DISCONNECT REPOSITORY - Add event listener only if button exists
const disconnectBtn = document.getElementById("disconnectBtn");
if (disconnectBtn) {
    disconnectBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to disconnect the current repository?")) {
            chrome.storage.local.remove(['repoConfig'], () => {
                showSuccess("Repository disconnected successfully!");
                checkRepoStatus(); // Refresh the status display
            });
        }
    });
}

// Utility functions for showing messages
function showError(message) {
    const statusDiv = document.getElementById("repoStatus");
    statusDiv.innerHTML = `
        <div style="color: red; margin-bottom: 10px; padding: 8px; border: 1px solid #f44336; border-radius: 4px; background-color: #ffeaea;">
            ❌ ${message}
        </div>
    `;
}
function showSuccess(message) {
    const statusDiv = document.getElementById("repoStatus");
    statusDiv.innerHTML = `
        <div style="color: green; margin-bottom: 10px; padding: 8px; border: 1px solid #4CAF50; border-radius: 4px; background-color: #f0f8f0;">
            ✅ ${message}
        </div>
    `;
}

// Auto-clear success/error messages after 5 seconds
function showTemporaryMessage(message, type = 'info') {
    const statusDiv = document.getElementById("repoStatus");
    const color = type === 'error' ? 'red' : type === 'success' ? 'green' : 'blue';
    const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    const bgColor = type === 'error' ? '#ffeaea' : type === 'success' ? '#f0f8f0' : '#e3f2fd';
    const borderColor = type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3';

    statusDiv.innerHTML = `
        <div style="color: ${color}; margin-bottom: 10px; padding: 8px; border: 1px solid ${borderColor}; border-radius: 4px; background-color: ${bgColor};">
            ${icon} ${message}
        </div>
    `;

    setTimeout(() => {
        checkRepoStatus(); // Restore normal status after 5 seconds
    }, 5000);
}