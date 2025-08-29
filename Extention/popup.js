// Add CSS for animations and light theme
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
    
    .light-theme .platform-card {
        background: rgba(0, 0, 0, 0.05) !important;
    }
    
    .light-theme .theme-toggle {
        background: rgba(0, 0, 0, 0.1) !important;
    }
    
    .light-theme .theme-toggle:hover {
        background: rgba(0, 0, 0, 0.2) !important;
    }
    
    /* Platform Selection Page Styles */
    .platform-selection-header {
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        gap: 10px;
        align-items: center;
    }
    
    .platform-logout-btn {
        background: rgba(255, 255, 255, 0.1);
        color: #60a5fa;
        border: 1px solid #60a5fa;
        border-radius: 6px;
        padding: 6px 12px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        margin-top: 40px;
        transition: all 0.3s ease;
    }
    
    .platform-logout-btn:hover {
        background: #60a5fa;
        color: white;
    }
    
    .platform-user-section {
        text-align: center;
        margin-bottom: 30px;
    }
    
    .platform-user-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin: 0 auto 15px;
        border: 3px solid rgba(255, 255, 255, 0.2);
        display: block;
    }
    
    .platform-username {
        font-size: 18px;
        font-weight: 600;
        color: #ffffff;
        margin-bottom: 30px;
    }
    
    .platform-icons-row {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin: 20px 0 30px 0;
        flex-wrap: wrap;
    }
    
    .platform-icon {
        width: 60px;
        height: 60px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }
    
    // .platform-icon:hover {
    //     background: rgba(255, 255, 255, 0.2);
    //     transform: translateY(-2px);
    // }
    
    .platform-icon img {
        width: 35px;
        height: 35px;
        object-fit: contain;
    }
    
    .platform-support-text {
        text-align: center;
        font-size: 14px;
        color: #9ca3af;
        margin-top: 20px;
        line-height: 1.4;
    }
`;
document.head.appendChild(style);

// Default avatar SVG
const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiM2MGE1ZmEiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyLjI1YS43NS43NSAwIDAxLjc1Ljc1djIuMjVhLjc1Ljc1IDAgMDEtMS41IDBWM3EuNzUuNzUgMCAwMS43NS0uNzV6TTcuNSAxMmE0LjUgNC41IDAgMTE5IDAgNC41IDQuNSAwIDAxLTkgMHpNMTguODk0IDYuMTY2YS43NS43NSAwIDAwLTEuMDYtMS4wNmwtMS41OTEgMS41OWEuNzUuNzUgMCAxMDEuMDYgMS4wNmwxLjU5MS0xLjU5ek0yMS43NSAxMmEuNzUuNzUgMCAwMS0uNzUuNzVoLTIuMjVhLjc1Ljc1IDAgMDEwLTEuNUgyMWEuNzUuNzUgMCAwMS43NS43NXpNMTcuODM0IDE4Ljg5NGEuNzUuNzUgMCAwMDEuMDYtMS4wNmwtMS41OS0xLjU5MWEuNzUuNzUgMCAxMC0xLjA2MSAxLjA2bDEuNTkgMS41OTF6TTEyIDE4YS43NS43NSAwIDAxLjc1Ljc1VjIxYS43NS43NSAwIDAxLTEuNSAwdi0yLjI1QS43NS43NSAwIDAxMTIgMTh6TTcuNzU4IDE3LjMwM2EuNzUuNzUgMCAwMC0xLjA2MS0xLjA2bC0xLjU5MSAxLjU5YS43NS43NSAwIDAwMS4wNiAxLjA2MWwxLjU5MS0xLjU5ek02IDEyYS43NS43NSAwIDAxLS43NS43NUgzYS43NS43NSAwIDAxMC0xLjVoMi4yNUEuNzUuNzUgMCAwMTYgMTJ6TTYuNjk3IDcuNzU3YS43NS43NSAwIDAwMS4wNi0xLjA2bC0xLjU5LTEuNTkxYS43NS43NSAwIDAwLTEuMDYxIDEuMDZsMS41OSAxLjU5MXoiLz4KPC9zdmc+Cjwvc3ZnPgo=";

// Platform logos mapping
const PLATFORM_LOGOS = {
    leetcode: 'images/Leetcode-logo.png',
    hackerrank: 'images/HackerRank-logo.png',
    codechef: 'images/codechef-logo.png',
    geeksforgeeks: 'images/gfg-logo.png'
};

//Maps platform names to the URLs we need to detect 
const PLATFORM_URLS = {
    leetcode: 'leetcode.com',
    hackerrank: 'hackerrank.com',
    codechef: 'codechef.com',
    geeksforgeeks: 'geeksforgeeks.org'
};

// Current state tracking
let currentPlatform = null;

// Utility functions
function hideAllContent() {
    const contents = [
        'welcomeContent', 'loginContent', 'loggedInContent',
        'platformSelectionContent', 'syncingContent', 'successContent'
    ];
    contents.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });
}

function showContent(contentId) {
    hideAllContent();
    const element = document.getElementById(contentId);
    if (element) {
        element.style.display = 'block';
        element.classList.add('fade-in');

        // If showing platform selection, update its layout
        if (contentId === 'platformSelectionContent') {
            updatePlatformSelectionLayout();
        }
    }
}

//Detects which platform the user is on from a URL
function getPlatformFromUrl(url) {
    if (!url) return null;
    for (const [platform, platformUrl] of Object.entries(PLATFORM_URLS)) {
        if (url.includes(platformUrl)) {
            return platform; // returns 'leetcode', 'hackerrank', etc.
        }
    }
    return null; // return null if no match is found
}

function showError(message, containerId = 'repoStatus') {
    const statusDiv = document.getElementById(containerId);
    if (statusDiv) {
        statusDiv.innerHTML = `
            <div class="repo-status error">
                 ${message}
            </div>
        `;
    }
}

function showSuccess(message, containerId = 'repoStatus') {
    const statusDiv = document.getElementById(containerId);
    if (statusDiv) {
        statusDiv.innerHTML = `
            <div class="repo-status success">
                 ${message}
            </div>
        `;
    }
}

function showWarning(message, containerId = 'repoStatus') {
    const statusDiv = document.getElementById(containerId);
    if (statusDiv) {
        statusDiv.innerHTML = `
            <div class="repo-status warning">
                 ${message}
            </div>
        `;
    }
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const body = document.body;
            const isLight = body.classList.contains('light-theme');

            if (isLight) {
                body.classList.remove('light-theme');
                body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
            } else {
                body.classList.add('light-theme');
                body.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)';
            }
        });
    }
}

// Report bug functionality
function initReportBug() {
    const reportBugLinks = document.querySelectorAll('#reportBug');
    reportBugLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            chrome.tabs.create({ url: 'https://github.com/your-repo/issues' });
        });
    });
}

// GitHub login functionality
function initLogin() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            // Show loading state
            loginBtn.classList.add('loading');
            loginBtn.innerHTML = `
                <svg class="github-icon" viewBox="0 0 24 24" style="animation: spin 1s linear infinite;">
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                </svg>
                Connecting...
            `;

            try {
                chrome.runtime.sendMessage({ action: 'authWithGitHub' }, async (response) => {
                    // Reset button state
                    loginBtn.classList.remove('loading');
                    loginBtn.innerHTML = `
                        <svg class="github-icon" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Login with GitHub
                    `;

                    if (response && response.success) {
                        await showWelcomeState();
                    } else {
                        showError('Login failed! Please try again.', 'loginError');
                    }
                });
            } catch (error) {
                loginBtn.classList.remove('loading');
                loginBtn.innerHTML = `
                    <svg class="github-icon" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Login with GitHub
                `;
                showError('Connection error! Please try again.', 'loginError');
            }
        });
    }
}

// Initialize the popup based on login state
async function initializePopup() {
    // Check for user and repo config in storage
    const { username, repoConfig } = await chrome.storage.local.get(['username', 'repoConfig']);

    // Case 1: User is not logged in
    if (!username) {
        showContent('loginContent');
        return;
    }

    // Case 2: User is logged in but has NOT linked a repository
    if (!repoConfig || !repoConfig.connected) {
        showContent('welcomeContent'); // Start them at the welcome-repo linking flow
        return;
    }

    // Case 3: User is logged in AND has linked a repository
    // Now we detect the current tab's URL
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const detectedPlatform = getPlatformFromUrl(tab.url);

    if (detectedPlatform) {
        // A supported platform was detected, show the specific sync page
        showSyncingContent(detectedPlatform);
    } else {
        // No supported platform detected, show the general selection page
        showContent('platformSelectionContent');
    }
}

// This function now just updates the user info on various pages
async function updateAllUserInfo() {
    const { username, avatarUrl } = await chrome.storage.local.get(['username', 'avatarUrl']);
    if (username) {
        // Update Logged In / Repo Link page
        document.getElementById('userAvatar').src = avatarUrl || DEFAULT_AVATAR;
        document.getElementById('username').textContent = `Welcome, ${username}!`;
    }
}

// Show welcome state after successful login
async function showWelcomeState() {
    try {
        const result = await chrome.storage.local.get(['username', 'avatarUrl']);
        const { username, avatarUrl } = result;

        if (username) {
            // Update welcome page with user info
            const userAvatar = document.getElementById('userAvatar');
            const usernameElement = document.getElementById('username');

            if (userAvatar) {
                userAvatar.src = avatarUrl || DEFAULT_AVATAR;
            }
            if (usernameElement) {
                usernameElement.textContent = `Welcome, ${username}!`;
            }

            showContent('welcomeContent');
        } else {
            showError('Failed to load user information.');
        }
    } catch (error) {
        showError('Failed to load user information.');
    }
}

// Complete setup functionality
function initCompleteSetup() {
    const completeSetupBtn = document.getElementById('completeSetupBtn');
    if (completeSetupBtn) {
        completeSetupBtn.addEventListener('click', async () => {
            await showLoggedInState();
        });
    }
}

// Show logged in state with repository section
async function showLoggedInState() {
    try {
        const result = await chrome.storage.local.get(['username', 'avatarUrl']);
        const { username, avatarUrl } = result;

        if (username) {
            // Update logged in page with user info
            const userAvatar = document.getElementById('userAvatar');
            const usernameElement = document.getElementById('username');

            if (userAvatar) {
                userAvatar.src = avatarUrl || DEFAULT_AVATAR;
            }
            if (usernameElement) {
                usernameElement.textContent = `Welcome, ${username}!`;
            }

            showContent('loggedInContent');
            await checkRepoStatus();
        } else {
            showError('Failed to load user information.');
        }
    } catch (error) {
        showError('Failed to load user information.');
    }
}

// Check repository status
function checkRepoStatus() {
    try {
        chrome.runtime.sendMessage({ action: 'getRepoConfig' }, (response) => {
            const repoUrlInput = document.getElementById('repoUrl');
            const linkBtn = document.getElementById('linkBtn');
            const disconnectBtn = document.getElementById('disconnectBtn');
            const continueBtn = document.getElementById('continueToPlatformsBtn'); // Get the new button

            if (response?.success && response.config?.connected) {
                const config = response.config;
                showSuccess(`Connected to: <strong>${config.owner}/${config.repo}</strong>`);
                if (repoUrlInput) repoUrlInput.style.display = 'none';
                if (linkBtn) linkBtn.style.display = 'none';
                if (disconnectBtn) disconnectBtn.style.display = 'inline-block';
                if (continueBtn) continueBtn.style.display = 'inline-block'; // Show the continue button
            } else {
                showWarning('No repository linked.');
                if (repoUrlInput) repoUrlInput.style.display = 'block';
                if (linkBtn) linkBtn.style.display = 'inline-block';
                if (disconnectBtn) disconnectBtn.style.display = 'none';
                if (continueBtn) continueBtn.style.display = 'none'; // Hide the continue button
            }
        });
    } catch (error) {
        showError('Failed to check repository status.');
    }
}

// Repository linking functionality
function initRepositoryLinking() {
    const linkBtn = document.getElementById('linkBtn');
    if (linkBtn) {
        linkBtn.addEventListener('click', async () => {
            const repoUrl = document.getElementById('repoUrl')?.value.trim();
            if (!repoUrl) return showError('Please enter a repository URL.');
            if (!repoUrl.startsWith('https://github.com/')) return showError('Invalid GitHub repository URL.');

            const parts = repoUrl.replace('https://github.com/', '').split('/');
            if (parts.length < 2 || !parts[0] || !parts[1]) return showError('Invalid URL format.');

            const [owner, repo] = parts;

            linkBtn.disabled = true;
            linkBtn.textContent = 'Connecting...';
            showWarning('Validating repository...');

            chrome.runtime.sendMessage({ action: 'connectRepository', owner, repo }, (response) => {
                linkBtn.disabled = false;
                linkBtn.textContent = 'Link Repository';
                if (response?.success) {
                    showSuccess(`Repository ${owner}/${repo} linked!`);
                    checkRepoStatus();
                } else {
                    showError(response?.error || 'Failed to connect repository.');
                }
            });
        });
    }
}

// Disconnect repository functionality
function initRepositoryDisconnect() {
    const disconnectBtn = document.getElementById('disconnectBtn');
    if (disconnectBtn) {
        disconnectBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to disconnect the current repository?')) {
                chrome.storage.local.remove(['repoConfig'], () => {
                    showSuccess('Repository disconnected successfully!');
                    checkRepoStatus();
                });
            }
        });
    }
}

//Initialize the continue button
function initContinueButton() {
    const continueBtn = document.getElementById('continueToPlatformsBtn');
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            // This now runs the main logic to check the URL and show the correct page.
            initializePopup();
        });
    }
}

// Logout functionality
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            chrome.storage.local.clear(() => {
                showContent('loginContent');
            });
        });
    }
}

// Platform selection functionality
function initPlatformSelection() {
    const platformCards = document.querySelectorAll('.platform-card');
    platformCards.forEach(card => {
        card.addEventListener('click', () => {
            const platform = card.getAttribute('data-platform');
            if (platform) {
                currentPlatform = platform;
                showSyncingContent(platform);
            }
        });
    });

    // Add new layout when showing platform selection
    updatePlatformSelectionLayout();
}

// Update platform selection layout to match new design
async function updatePlatformSelectionLayout() {
    const platformContent = document.getElementById('platformSelectionContent');
    if (platformContent) {
        try {
            const result = await chrome.storage.local.get(['username', 'avatarUrl']);
            const { username, avatarUrl } = result;

            // Create new layout HTML
            platformContent.innerHTML = `
                <!-- Header with theme toggle and logout -->
                <div class="platform-selection-header">
                    <button class="platform-logout-btn" id="platformLogoutBtn">Log Out</button>
                </div>
                
                <!-- User Info Section -->
                <div class="platform-user-section">
                    <img class="platform-user-avatar" src="${avatarUrl || DEFAULT_AVATAR}" alt="User Avatar">
                    <div class="platform-username">${username || 'Username'}</div>
                </div>
                
                <!-- Platform Icons Row -->
                <div class="platform-icons-row">
                    <div class="platform-icon" data-platform="leetcode">
                        <img src="images/Leetcode-logo.png" alt="LeetCode">
                    </div>
                    <div class="platform-icon" data-platform="geeksforgeeks">
                        <img src="images/gfg-logo.png" alt="GeeksforGeeks">
                    </div>
                    <div class="platform-icon" data-platform="hackerrank">
                        <img src="images/HackerRank-logo.png" alt="HackerRank">
                    </div>
                    <div class="platform-icon" data-platform="codechef">
                        <img src="images/CodeChef-logo.png" alt="CodeChef">
                    </div>
                </div>
                
                <!-- Support Text -->
                <div class="platform-support-text">
                    We currently support following websites for this extension
                </div>
            `;

            // Re-attach event listeners for the new layout
            attachPlatformEventListeners();

        } catch (error) {
            console.error('Failed to update platform selection layout:', error);
        }
    }
}

// Attach event listeners for platform selection page
function attachPlatformEventListeners() {
    // Platform icon click handlers
    // const platformIcons = document.querySelectorAll('.platform-icon');
    // platformIcons.forEach(icon => {
    //     icon.addEventListener('click', () => {
    //         const platform = icon.getAttribute('data-platform');
    //         if (platform) {
    //             currentPlatform = platform;
    //             showSyncingContent(platform);
    //         }
    //     });
    // });

    // Theme toggle for platform page
    const platformThemeToggle = document.getElementById('platformThemeToggle');
    if (platformThemeToggle) {
        platformThemeToggle.addEventListener('click', () => {
            const body = document.body;
            const isLight = body.classList.contains('light-theme');

            if (isLight) {
                body.classList.remove('light-theme');
                body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
            } else {
                body.classList.add('light-theme');
                body.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)';
            }
        });
    }

    // Logout button for platform page
    const platformLogoutBtn = document.getElementById('platformLogoutBtn');
    if (platformLogoutBtn) {
        platformLogoutBtn.addEventListener('click', () => {
            chrome.storage.local.clear(() => {
                showContent('loginContent');
            });
        });
    }
}
// Show syncing content for selected platform
async function showSyncingContent(platform) {
    try {
        const result = await chrome.storage.local.get(['username', 'avatarUrl']);
        const { username, avatarUrl } = result;

        // Update syncing page with user info
        const syncUserAvatar = document.getElementById('syncUserAvatar');
        const syncUsername = document.getElementById('syncUsername');
        const platformLogo = document.getElementById('platformLogo');
        const syncDescription = document.getElementById('syncDescription');

        if (syncUserAvatar) {
            syncUserAvatar.src = avatarUrl || DEFAULT_AVATAR;
        }
        if (syncUsername) {
            syncUsername.textContent = username || 'User';
        }
        if (platformLogo && PLATFORM_LOGOS[platform]) {
            // Create the image tag dynamically using the local path
            platformLogo.innerHTML = `
            <div class="platform-selection-header">
                    <button class="platform-logout-btn" id="platformLogoutBtn">Log Out</button>
                </div>
            <img src="${PLATFORM_LOGOS[platform]}" alt="${platform} logo">`;
        }
        if (syncDescription) {
            syncDescription.textContent = `Syncing your ${platform.charAt(0).toUpperCase() + platform.slice(1)} solutions to your GitHub`;
        }

        showContent('syncingContent');
    } catch (error) {
        showError('Failed to load syncing page.');
    }

}

// Back button functionality from syncing to platform selection
// function initBackButton() {
//     const backBtn = document.getElementById('backBtn');
//     if (backBtn) {
//         backBtn.addEventListener('click', () => {
//             showContent('platformSelectionContent');
//         });
//     }
// }

// Success page back button
// function initSuccessBackButton() {
//     const successBackBtn = document.getElementById('successBackBtn');
//     if (successBackBtn) {
//         successBackBtn.addEventListener('click', () => {
//             // This line takes you to the page with the "Continue" button
//             showContent('loggedInContent');
//         });
//     }
// }

// Syncing content click to simulate sync
// function initSyncNowButton() {
//     const syncBtn = document.getElementById('syncNowBtn');
//     if (syncBtn) {
//         syncBtn.addEventListener('click', () => {
//             // Optional: Show a temporary "Syncing..." state
//             syncBtn.textContent = 'Syncing...';
//             syncBtn.disabled = true;

//             // Simulate a sync delay
//             setTimeout(() => {
//                 showContent('successContent');

//                 // Reset button for the next time it's shown
//                 syncBtn.textContent = 'Sync Now';
//                 syncBtn.disabled = false;
//             }, 1000);
//         });
//     }
// }


// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize all components
    initThemeToggle();
    initReportBug();
    initLogin();
    initCompleteSetup();
    initRepositoryLinking();
    initRepositoryDisconnect();
    initContinueButton();
    initLogout();
    initPlatformSelection();
    // initBackButton();
    // initSuccessBackButton();
    // initSyncNowButton();

    // Initialize the popup state
    await initializePopup();
});