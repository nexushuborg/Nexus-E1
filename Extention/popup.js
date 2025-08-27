// Theme toggle functionality
document.getElementById("themeToggle").addEventListener("click", () => {
    const body = document.body;
    const isDark = body.classList.contains("light-theme");
    
    if (isDark) {
        body.classList.remove("light-theme");
        body.style.background = "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)";
    } else {
        body.classList.add("light-theme");
        body.style.background = "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)";
    }
});

// Complete setup button functionality
document.getElementById("completeSetupBtn").addEventListener("click", () => {
    document.getElementById("welcomeContent").style.display = "none";
    document.getElementById("loggedInContent").style.display = "block";
    document.getElementById("loggedInContent").classList.add("fade-in");
    // Initialize repo status when showing the repo linking page
    checkRepoStatus();
});

// Report bug functionality
document.getElementById("reportBug").addEventListener("click", (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: "https://github.com/your-repo/issues" });
});

// Login functionality
document.getElementById("loginBtn").addEventListener("click", () => {
    const loginBtn = document.getElementById("loginBtn");
    loginBtn.classList.add("loading");
    loginBtn.innerHTML = `
        <svg class="github-icon" viewBox="0 0 24 24" style="animation: spin 1s linear infinite;">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
        </svg>
        Connecting...
    `;

    chrome.runtime.sendMessage({ action: "authWithGitHub" }, async (response) => {
        loginBtn.classList.remove("loading");
        loginBtn.innerHTML = `
            <svg class="github-icon" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Login with GitHub
        `;

        if (response?.jwt) {
            // After successful login, show welcome page
            const { username, avatarUrl } = await chrome.storage.local.get(["username", "avatarUrl"]);
            if (username) {
                document.getElementById("userAvatar").src = avatarUrl || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiM2MGE1ZmEiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyLjI1YS43NS43NSAwIDAxLjc1Ljc1djIuMjVhLjc1Ljc1IDAgMDEtMS41IDBWM3EuNzUuNzUgMCAwMS43NS0uNzV6TTcuNSAxMmE0LjUgNC41IDAgMTE5IDAgNC41IDQuNSAwIDAxLTkgMHpNMTguODk0IDYuMTY2YS43NS43NSAwIDAwLTEuMDYtMS4wNmwtMS41OTEgMS41OWEuNzUuNzUgMCAxMDEuMDYgMS4wNmwxLjU5MS0xLjU5ek0yMS43NSAxMmEuNzUuNzUgMCAwMS0uNzUuNzVoLTIuMjVhLjc1Ljc1IDAgMDEwLTEuNUgyMWEuNzUuNzUgMCAwMS43NS43NXpNMTcuODM0IDE4Ljg5NGEuNzUuNzUgMCAwMDEuMDYtMS4wNmwtMS41OS0xLjU5MWEuNzUuNzUgMCAxMC0xLjA2MSAxLjA2bDEuNTkgMS41OTF6TTEyIDE4YS43NS43NSAwIDAxLjc1Ljc1VjIxYS43NS43NSAwIDAxLTEuNSAwdi0yLjI1QS43NS43NSAwIDAxMTIgMTh6TTcuNzU4IDE3LjMwM2EuNzUuNzUgMCAwMC0xLjA2MS0xLjA2bC0xLjU5MSAxLjU5YS43NS43NSAwIDAwMS4wNiAxLjA2MWwxLjU5MS0xLjU5ek02IDEyYS43NS43NSAwIDAxLS43NS43NUgzYS43NS43NSAwIDAxMC0xLjVoMi4yNUEuNzUuNzUgMCAwMTYgMTJ6TTYuNjk3IDcuNzU3YS43NS43NSAwIDAwMS4wNi0xLjA2bC0xLjU5LTEuNTkxYS43NS43NSAwIDAwLTEuMDYxIDEuMDZsMS41OSAxLjU5MXoiLz4KPC9zdmc+Cjwvc3ZnPgo=";
                document.getElementById("username").textContent = `Welcome, ${username}!`;
                
                document.getElementById("loginContent").style.display = "none";
                document.getElementById("welcomeContent").style.display = "block";
                document.getElementById("welcomeContent").classList.add("fade-in");
            }
        } else {
            showError("Login failed! Please try again.");
        }
    });
});

// Show logged in state
async function showLoggedInState() {
    const { username, avatarUrl } = await chrome.storage.local.get(["username", "avatarUrl"]);
    
    if (username) {
        document.getElementById("userAvatar").src = avatarUrl || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiM2MGE1ZmEiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyLjI1YS43NS43NSAwIDAxLjc1Ljc1djIuMjVhLjc1Ljc1IDAgMDEtMS41IDBWM3EuNzUuNzUgMCAwMS43NS0uNzV6TTcuNSAxMmE0LjUgNC41IDAgMTE5IDAgNC41IDQuNSAwIDAxLTkgMHpNMTguODk0IDYuMTY2YS43NS43NSAwIDAwLTEuMDYtMS4wNmwtMS41OTEgMS41OWEuNzUuNzUgMCAxMDEuMDYgMS4wNmwxLjU5MS0xLjU5ek0yMS43NSAxMmEuNzUuNzUgMCAwMS0uNzUuNzVoLTIuMjVhLjc1Ljc1IDAgMDEwLTEuNUgyMWEuNzUuNzUgMCAwMS43NS43NXpNMTcuODM0IDE4Ljg5NGEuNzUuNzUgMCAwMDEuMDYtMS4wNmwtMS41OS0xLjU5MWEuNzUuNzUgMCAxMC0xLjA2MSAxLjA2bDEuNTkgMS41OTF6TTEyIDE4YS43NS43NSAwIDAxLjc1Ljc1VjIxYS43NS43NSAwIDAxLTEuNSAwdi0yLjI1QS43NS43NSAwIDAxMTIgMTh6TTcuNzU4IDE3LjMwM2EuNzUuNzUgMCAwMC0xLjA2MS0xLjA2bC0xLjU5MSAxLjU5YS43NS43NSAwIDAwMS4wNiAxLjA2MWwxLjU5MS0xLjU5ek02IDEyYS43NS43NSAwIDAxLS43NS43NUgzYS43NS43NSAwIDAxMC0xLjVoMi4yNUEuNzUuNzUgMCAwMTYgMTJ6TTYuNjk3IDcuNzU3YS43NS43NSAwIDAwMS4wNi0xLjA2bC0xLjU5LTEuNTkxYS43NS43NSAwIDAwLTEuMDYxIDEuMDZsMS41OSAxLjU5MXoiLz4KPC9zdmc+Cjwvc3ZnPgo=";
        document.getElementById("username").textContent = `Welcome, ${username}!`;
        
        // Show welcome page first, then user can proceed to repo linking
        document.getElementById("loginContent").style.display = "none";
        document.getElementById("welcomeContent").style.display = "block";
        document.getElementById("welcomeContent").classList.add("fade-in");
    } else {
        showError("Failed to load user information.");
    }
}

// Check repository status
async function checkRepoStatus() {
    chrome.runtime.sendMessage({ action: "getRepoConfig" }, (response) => {
        const repoStatusDiv = document.getElementById("repoStatus");
        const repoUrlInput = document.getElementById("repoUrl");
        const linkBtn = document.getElementById("linkBtn");
        const disconnectBtn = document.getElementById("disconnectBtn");

        if (response.success && response.config && response.config.connected) {
            // Repository is connected
            const config = response.config;
            repoStatusDiv.innerHTML = `
                <div class="repo-status success">
                    ✅ Connected to: <strong>${config.owner}/${config.repo}</strong>
                    <br><small>Connected on: ${new Date(config.connectedAt).toLocaleDateString()}</small>
                </div>
            `;

            repoUrlInput.style.display = "none";
            linkBtn.style.display = "none";
            disconnectBtn.style.display = "inline-block";
        } else {
            // No repository connected
            repoStatusDiv.innerHTML = `
                <div class="repo-status warning">
                     No repository linked. Please connect a repository to auto-save solutions.
                </div>
            `;
            repoUrlInput.style.display = "block";
            linkBtn.style.display = "inline-block";
            disconnectBtn.style.display = "none";
        }
    });
}

// Logout functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "logout" }, (response) => {
        if (response.success) {
            document.getElementById("loggedInContent").style.display = "none";
            document.getElementById("welcomeContent").style.display = "block";
            document.getElementById("welcomeContent").classList.add("fade-in");
        } else {
            showError("Logout failed!");
        }
    });
});

// Repository linking functionality
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
    linkBtn.classList.add("loading");
    statusDiv.innerHTML = '<div class="repo-status warning">🔄 Validating repository...</div>';

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
                    statusDiv.innerHTML = '<div class="repo-status warning">🔄 Setting up directory structure...</div>';

                    chrome.runtime.sendMessage(
                        {
                            action: "connectRepository",
                            owner: owner,
                            repo: repo
                        },
                        (connectResponse) => {
                            linkBtn.disabled = false;
                            linkBtn.textContent = "Link Repository";
                            linkBtn.classList.remove("loading");

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
                    linkBtn.classList.remove("loading");
                    showError(`Repository validation failed: ${response.error}`);
                }
            }
        );
    } catch (error) {
        linkBtn.disabled = false;
        linkBtn.textContent = "Link Repository";
        linkBtn.classList.remove("loading");
        showError(`Connection error: ${error.message}`);
    }
});

// Disconnect repository functionality
document.getElementById("disconnectBtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to disconnect the current repository?")) {
        chrome.storage.local.remove(['repoConfig'], () => {
            showSuccess("Repository disconnected successfully!");
            checkRepoStatus(); // Refresh the status display
        });
    }
});

// Utility functions for showing messages
function showError(message) {
    const statusDiv = document.getElementById("repoStatus");
    statusDiv.innerHTML = `
        <div class="repo-status error">
            ❌ ${message}
        </div>
    `;
}

function showSuccess(message) {
    const statusDiv = document.getElementById("repoStatus");
    statusDiv.innerHTML = `
        <div class="repo-status success">
            ✅ ${message}
        </div>
    `;
}

// Initialize the popup
document.addEventListener("DOMContentLoaded", async () => {
    const { username } = await chrome.storage.local.get(["username"]);

    if (username) {
        // User is logged in - show welcome page first
        await showLoggedInState();
    } else {
        // User is not logged in - show authorization page first
        document.getElementById("loginContent").style.display = "block";
        document.getElementById("welcomeContent").style.display = "none";
        document.getElementById("loggedInContent").style.display = "none";
    }
});

// Add CSS for loading animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .light-theme {
        color: #1f2937 !important;
    }
    
    .light-theme .title,
    .light-theme .username,
    .light-theme .repo-title {
        color: #1f2937 !important;
    }
    
    .light-theme .description,
    .light-theme .info-text,
    .light-theme .support-link {
        color: #6b7280 !important;
    }
    
    .light-theme .repo-section {
        background: rgba(0, 0, 0, 0.05) !important;
        border: 1px solid rgba(0, 0, 0, 0.1) !important;
    }
    
    .light-theme .repo-input {
        background: rgba(0, 0, 0, 0.05) !important;
        border: 1px solid rgba(0, 0, 0, 0.2) !important;
        color: #1f2937 !important;
    }
    
    .light-theme .repo-input::placeholder {
        color: #6b7280 !important;
    }
    
    .light-theme .repo-status.warning {
        background: rgba(245, 158, 11, 0.1) !important;
        border: 1px solid rgba(245, 158, 11, 0.3) !important;
        color: #d97706 !important;
    }
    
    .light-theme .repo-status.success {
        background: rgba(34, 197, 94, 0.1) !important;
        border: 1px solid rgba(34, 197, 94, 0.3) !important;
        color: #16a34a !important;
    }
    
    .light-theme .repo-status.error {
        background: rgba(239, 68, 68, 0.1) !important;
        border: 1px solid rgba(239, 68, 68, 0.3) !important;
        color: #dc2626 !important;
    }
`;
document.head.appendChild(style);