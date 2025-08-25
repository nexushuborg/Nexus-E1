chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  console.log(chrome.storage.local);
});

// GitHub Repository Manager Class
class GitHubRepositoryManager {
  constructor() {
    this.baseURL = 'https://api.github.com';
  }

  async getAccessToken() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['accessToken'], (result) => {
        resolve(result.accessToken || null);
      });
    });
  }

  async getRepoConfig() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['repoConfig'], (result) => {
        resolve(result.repoConfig || null);
      });
    });
  }

  async saveRepoConfig(owner, repo) {
    const config = {
      owner,
      repo,
      connected: true,
      connectedAt: new Date().toISOString()
    };

    return new Promise((resolve) => {
      chrome.storage.local.set({ repoConfig: config }, () => {
        console.log('Repository configuration saved:', config);
        resolve(config);
      });
    });
  }

  async validateRepository(owner, repo) {
    const token = await this.getAccessToken();
    if (!token) {
      return { success: false, error: 'No access token found. Please authenticate first.' };
    }

    try {
      const response = await fetch(`${this.baseURL}/repos/${owner}/${repo}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        const repoData = await response.json();
        return {
          success: true,
          data: {
            name: repoData.name,
            full_name: repoData.full_name,
            private: repoData.private,
            permissions: repoData.permissions
          }
        };
      } else if (response.status === 404) {
        return { success: false, error: 'Repository not found' };
      } else if (response.status === 403) {
        return { success: false, error: 'Access denied. Check repository permissions.' };
      } else {
        return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
      }
    } catch (error) {
      return { success: false, error: `Network error: ${error.message}` };
    }
  }

  async ensureDirectoryStructure(owner, repo) {
    const token = await this.getAccessToken();
    const platforms = ['LeetCode', 'GFG', 'HackerRank', "CodeChef"];
    const difficulties = ['Easy', 'Medium', 'Hard'];

    const results = [];

    for (const platform of platforms) {
      for (const difficulty of difficulties) {
        const path = `${platform}/${difficulty}/.README.md`;
        const result = await this.createFileIfNotExists(owner, repo, path, '', token);
        results.push({
          path: `${platform}/${difficulty}`,
          success: result.success,
          message: result.message
        });
      }
    }

    return results;
  }

  async createFileIfNotExists(owner, repo, path, content = '', token) {
    try {
      // Check if file exists
      const checkResponse = await fetch(`${this.baseURL}/repos/${owner}/${repo}/contents/${path}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (checkResponse.ok) {
        return { success: true, message: 'Directory already exists' };
      }

      // Create file if it doesn't exist
      const createResponse = await fetch(`${this.baseURL}/repos/${owner}/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Create directory structure: ${path}`,
          content: btoa(content) // Base64 encode
        })
      });

      if (createResponse.ok) {
        return { success: true, message: 'Directory created successfully' };
      } else {
        const errorData = await createResponse.json();
        return { success: false, message: errorData.message || 'Failed to create directory' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async saveSolution(problemData, solutionCode) {
    const repoConfig = await this.getRepoConfig();
    const token = await this.getAccessToken();

    if (!repoConfig || !token) {
      console.error('Repository not configured or no access token');
      return { success: false, error: 'Repository not configured' };
    }

    const filePath = this.generateFilePath(problemData);
    const fileName = this.generateFileName(problemData);
    const fullPath = `${filePath}/${fileName}`;
    const readmePath = `${filePath}/README.md`;

    try {
      // ---------------Save code solutions------------------- 
      // First, check if file already exists and get its SHA
      let existingSha = null;

      const checkResponse = await fetch(`${this.baseURL}/repos/${repoConfig.owner}/${repoConfig.repo}/contents/${fullPath}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (checkResponse.ok) {
        const existingFile = await checkResponse.json();
        existingSha = existingFile.sha;
        console.log(`File exists, SHA: ${existingSha}`);
      }

      function b64EncodeUnicode(str) {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(str);
        let binary = '';
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
      }

      // Prepare the request body
      const requestBody = {
        message: `${existingSha ? 'Update' : 'Add'} solution: ${problemData.title} (${problemData.platform})`,
        content: b64EncodeUnicode(solutionCode), // Base64 encode
        sha: existingSha || undefined
      };

      // Include SHA if file exists (for updates)
      if (existingSha) {
        requestBody.sha = existingSha;
      }

      // Create or update the file
      const response = await fetch(`${this.baseURL}/repos/${repoConfig.owner}/${repoConfig.repo}/contents/${fullPath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(`Solution ${existingSha ? 'updated' : 'created'} successfully: ${fullPath}`);
      } else {
        const errorData = await response.json();
        console.error('Failed to save solution:', errorData);
        return { success: false, error: errorData.message };
      }

      // ------------------Save README.md with problem statement----------------
      let readmeSha = null;
      const readmeCheck = await fetch(`${this.baseURL}/repos/${repoConfig.owner}/${repoConfig.repo}/contents/${readmePath}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (readmeCheck.ok) {
        const existingReadme = await readmeCheck.json();
        readmeSha = existingReadme.sha;
      }

      const readmeBody = {
        message: `${readmeSha ? 'Update' : 'Add'} README: ${problemData.title} (${problemData.platform})`,
        content: b64EncodeUnicode(problemData.readme)
      };

      if (readmeSha) {
        readmeBody.sha = readmeSha;
      }

      const readmeResponse = await fetch(`${this.baseURL}/repos/${repoConfig.owner}/${repoConfig.repo}/contents/${readmePath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(readmeBody)
      });

      if (readmeResponse.ok) {
        console.log(`README ${readmeSha ? 'updated' : 'created'} successfully: ${readmePath}`);
      } else {
        const readmeError = await readmeResponse.json();
        console.error('Failed to save README:', readmeError);
      }

      // ------------------Save README.md with ai notes----------------
      const notesRes = await fetch("http://localhost:5000/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          code: solutionCode,
          language: problemData.language || "javascript",
          title: problemData.title || "",
          // repositoryUrl: `${repoConfig.owner}/${repoConfig.repo}`, // or full https url if required
          // filePath: `${filePath}/${fileName}`
        })
      });

      console.log(solutionCode);
      console.log(problemData.language);
      console.log(problemData.title);

      if (!notesRes.ok) {
        const err = await notesRes.json();
        console.error("Failed to fetch AI notes:", err);
      } else {
        const notesData = await notesRes.json();
        const notesContent = `
          # ${notesData.data.title}

          **Summary:** ${notesData.data.summary}

          - Time Complexity: ${notesData.data.timeComplexity}
          - Space Complexity: ${notesData.data.spaceComplexity}
          `; // assuming API returns { notes: "..." }

        const notesPath = `${filePath}/NOTES.md`;

        // check if NOTES.md exists
        let notesSha = null;
        const notesCheck = await fetch(`${this.baseURL}/repos/${repoConfig.owner}/${repoConfig.repo}/contents/${notesPath}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (notesCheck.ok) {
          const existingNotes = await notesCheck.json();
          notesSha = existingNotes.sha;
        }

        const notesBody = {
          message: `${notesSha ? 'Update' : 'Add'} NOTES: ${problemData.title} (${problemData.platform})`,
          content: btoa(notesContent)
        };

        if (notesSha) {
          notesBody.sha = notesSha;
        }

        const notesResponse = await fetch(`${this.baseURL}/repos/${repoConfig.owner}/${repoConfig.repo}/contents/${notesPath}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(notesBody)
        });

        if (notesResponse.ok) {
          console.log(`NOTES ${notesSha ? 'updated' : 'created'} successfully: ${notesPath}`);
        } else {
          const notesError = await notesResponse.json();
          console.error('Failed to save NOTES:', notesError);
        }
      }

      return { success: true, path: filePath };

    } catch (error) {
      console.error('Error saving solution:', error);
      return { success: false, error: error.message };
    }
  }

  generateFilePath(problemData) {
    const platformMap = {
      'GfgSoln': 'GFG',
      'CfSoln': 'CodeChef',
      'HrSoln': 'HackerRank',
      'LcSoln': 'LeetCode'
    };

    const platform = platformMap[problemData.platform] || 'GFG';
    const difficulty = this.capitalizeDifficulty(problemData.difficulty || 'Medium');
    const ProblemTitle = problemData.title;

    return `${platform}/${difficulty}/${ProblemTitle}`;
  }

  generateFileName(problemData) {
    const title = problemData.title || 'Untitled_Problem';
    const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    const extension = this.getFileExtension(problemData.language || 'txt');

    // debug 
    console.log('Clean title:', cleanTitle);
    console.log('Final extension:', extension);
    console.log('=== End generateFileName Debug ===');

    return `${cleanTitle}.${extension}`;
  }

  capitalizeDifficulty(difficulty) {
    const diffMap = {
      'easy': 'Easy',
      'Basic': 'Easy',
      'Beginner': 'Easy',
      'medium': 'Medium',
      'hard': 'Hard',
      'Easy': 'Easy',
      'Medium': 'Medium',
      'Hard': 'Hard',
      'Advanced': 'Hard',
      'Expert': 'Hard',
      "Intermediate": "Medium"
    };
    return diffMap[difficulty] || 'Medium';
  }

  getFileExtension(language) {
    console.log('Getting extension for language:', language);

    // Convert to lowercase and handle different variations
    const normalizedLang = language.toLowerCase().trim();

    const langMap = {
      // C++ variations
      'cpp': 'cpp',
      'c++': 'cpp',
      'c++11': 'cpp',
      'c++14': 'cpp',
      'c++17': 'cpp',
      'c++20': 'cpp',
      'gcc': 'cpp',

      // Java variations
      'java': 'java',
      'java8': 'java',
      'java 8': 'java',
      'java11': 'java',
      'java 11': 'java',

      // Python variations
      'python': 'py',
      'python3': 'py',
      'python 3': 'py',
      'python2': 'py',
      'python 2': 'py',
      'pypy': 'py',
      'pypy3': 'py',

      // JavaScript variations
      'javascript': 'js',
      'js': 'js',
      'node': 'js',
      'nodejs': 'js',
      'node.js': 'js',

      // C variations
      'c': 'c',

      // C# variations
      'csharp': 'cs',
      'c#': 'cs',
      'c sharp': 'cs',

      // Other languages
      'go': 'go',
      'golang': 'go',
      'rust': 'rs',
      'kotlin': 'kt',
      'swift': 'swift',
      'php': 'php',
      'ruby': 'rb',
      'scala': 'scala',
      'r': 'r',
      'perl': 'pl',
      'bash': 'sh',
      'shell': 'sh',
      'sql': 'sql',
      'mysql': 'sql',
      'postgresql': 'sql',
      'oracle': 'sql'
    };

    // Try exact match first
    let extension = langMap[normalizedLang];

    // If no exact match, try partial matching
    if (!extension) {
      for (const [key, value] of Object.entries(langMap)) {
        if (normalizedLang.includes(key) || key.includes(normalizedLang)) {
          extension = value;
          break;
        }
      }
    }

    // Default to txt if no match found
    extension = extension || 'txt';

    console.log(`Language "${language}" -> Extension "${extension}"`);
    return extension;
  }
}

const repoManager = new GitHubRepositoryManager();

// login
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "authWithGitHub") {

    const stored = await new Promise((resolve) => {
      chrome.storage.local.get(["username", "jwt", "avatarUrl"], resolve);
    });

    if (stored.username && stored.jwt) {
      console.log(`Already logged in as ${stored.username}`);
      sendResponse({
        message: "You are already logged in",
        username: stored.username,
        avatarUrl: stored.avatarUrl
      });
      return;
    }

    const redirectURL = chrome.identity.getRedirectURL();
    const state = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
    //save `state`
    chrome.storage.session.set({ oauthState: state });
    console.log("redirect url is " + redirectURL);

    chrome.identity.launchWebAuthFlow({
      url: `https://github.com/login/oauth/authorize?client_id=Ov23limgwxLHCgCu5kmJ&redirect_uri=${redirectURL}&state=${state}&scope=${encodeURIComponent("read:user repo")}`,
      interactive: true
    }, async (responseUrl) => {
      if (chrome.runtime.lastError) {
        console.error("Auth failed:", chrome.runtime.lastError);
        sendResponse({ error: "Auth failed" });
        return;
      }
      console.log("Auth response:", responseUrl);

      // to get the code out of the responseUrl
      const params = new URL(responseUrl).searchParams;
      const code = params.get("code");
      const returnedState = params.get("state");

      // compare with stored state
      //chrome.storage.session.get : returns a prom that is async
      const { oauthState } = await chrome.storage.session.get("oauthState");
      if (returnedState !== oauthState) {
        console.log("Invalid state, possible CSRF attack.");
        sendResponse({ error: "Invalid state" });
        return;
      }

      // exchanges the code to get the token
      const tokenResponse = await fetch("http://localhost:5000/api/auth/exchange-code", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          code,
          redirect_uri: redirectURL
        })
      });

      const tokenData = await tokenResponse.json();
      console.log("Access token response:", tokenData);

      // only for authenticated users
      const userRes = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${tokenData.accessToken}` }
      });
      const userData = await userRes.json();
      console.log("User profile response:", userData);

      await chrome.storage.local.set({
        accessToken: tokenData.accessToken,
        jwt: tokenData.jwt,
        username: userData.login,
        avatarUrl: userData.avatar_url,
        scopes: userData.scopes
      });

      sendResponse({
        jwt: tokenData.jwt,
        username: userData.login,
        avatarUrl: userData.avatar_url,
        scopes: userData.scopes
      });

      // repo section appears just after login
      chrome.runtime.sendMessage({ action: "showRepoLink" });
    });

    return true;
  }
});

// New message listeners for repository management
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "validateRepository") {
    repoManager.validateRepository(request.owner, request.repo)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }

  if (request.action === "connectRepository") {
    (async () => {
      try {
        // First validate the repository
        const validation = await repoManager.validateRepository(request.owner, request.repo);
        if (!validation.success) {
          sendResponse(validation);
          return;
        }

        // Save repository configuration
        const config = await repoManager.saveRepoConfig(request.owner, request.repo);

        // Ensure directory structure
        const structureResult = await repoManager.ensureDirectoryStructure(request.owner, request.repo);

        sendResponse({
          success: true,
          config: config,
          structure: structureResult,
          repoData: validation.data
        });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true;
  }

  if (request.action === "getRepoConfig") {
    repoManager.getRepoConfig()
      .then(config => sendResponse({ success: true, config }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

//logout:just clear the local storage
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "logout") {
    // debug
    chrome.storage.local.get(["jwt", "username", "avatarUrl", "scopes"], (result) => {
      console.log("Stored data:", result);

      if (result.jwt) {
        console.log("Username:", result.username);
        console.log("jwt:", result.jwt);
        console.log("Avatar URL:", result.avatarUrl);
        console.log("Scopes:", result.scopes);
      } else {
        console.log("No user logged in.");
      }
    });
    chrome.storage.local.clear().then(() => {
      console.log("All user data cleared.");
      sendResponse({ success: true });
    });
    return true;
  }
});

// Webscrapping Part start

function checkEvent() {
  console.log('listening to event');
  window.addEventListener('DataSend', (e) => {
    console.log(e.detail);

    chrome.runtime.sendMessage({
      id: e.detail.id,
      resData: e.detail.resData
    })


  })
}

const GFG_SUBMIT_URL = 'https://practiceapiorigin.geeksforgeeks.org/api/latest/problems/submission/submit/result/';
const CODECHEF_SUBMIT_URL = 'https://www.codechef.com/error_status_table/';
const HACKERRANK_SUMBIT_URL = 'https://www.hackerrank.com/rest/contests/master/testcases/';
const LEETCODE_SUBMIT_URL = "https://leetcode.com/submissions/detail/";

//Submission Trigger, Web Scrapping entry point

chrome.webRequest.onCompleted.addListener(
  (details) => {
    let scriptToInject = null;

    if (details.url.startsWith(GFG_SUBMIT_URL) && details.method === 'POST') {
      console.log('GFG submission detected.');
      scriptToInject = 'script/getSolGfg.js';
    }
    else if (details.url.startsWith(CODECHEF_SUBMIT_URL) && details.method === 'GET') {
      console.log('CodeChef submission detected.');
      scriptToInject = 'script/getSolCf.js';
    }
    else if (details.url.startsWith(HACKERRANK_SUMBIT_URL) && details.method === 'GET') {
      console.log('Hackerrank Submission detected.');
      scriptToInject = 'script/getSolHr.js'
    }
    else if (details.url.startsWith(LEETCODE_SUBMIT_URL) && details.method === "GET") {
      console.log("Leetcode Submission detected.");
      scriptToInject = 'script/getSolLc.js';
    }
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      func: checkEvent
    });

    if (scriptToInject && details.tabId > 0) {
      setTimeout(() => {
        chrome.scripting.executeScript({
          target: { tabId: details.tabId },
          files: [scriptToInject],
          world: 'MAIN',
        });
      }, 1500);
    }
  },
  {
    urls: [
      "https://practiceapiorigin.geeksforgeeks.org/api/latest/problems/submission/submit/result/",
      "https://www.codechef.com/error_status_table/*",
      "https://www.hackerrank.com/rest/contests/master/testcases/*/*/testcase_data",
      "https://leetcode.com/submissions/detail/*/check/"
    ]
  }
);

var isProcessing = false

//Result Fetcher, Web Scrapping exit point
chrome.runtime.onMessage.addListener(async (request, sender, sendRes) => {

  //debug
  console.log('Received the message', request.id);

  if (request.id === 'GfgSoln' && !isProcessing) {
    isProcessing = true;

    // Extract problem data from request.resData
    const problemData = {
      platform: 'GfgSoln',
      fileName: request.resData.Problem_Title,
      title: request.resData.Problem_Title,
      difficulty: request.resData.Problem_Difficulty,
      language: request.resData.Solution_Language,
      readme: request.resData.Problem_Statement,
    };

    // Extract from DOM
    const solutionCode = request.resData.Solution_Code;

    // Save to GitHub
    const result = await repoManager.saveSolution(problemData, solutionCode);

    if (result.success) {
      console.log(`Solution saved to: ${result.path}`);
    } else {
      console.error(`Failed to save solution: ${result.error}`);
    }

    console.log(isProcessing);

    console.log("GFG response");
    console.log(request);
  }
  else if (request.id === 'CfSoln' && !isProcessing) {
    isProcessing = true;

    const problemData = {
      platform: 'CfSoln',
      fileName: request.resData.Problem_Title,
      title: request.resData.Problem_Title,
      difficulty: request.resData.Problem_Difficulty,
      language: request.resData.Solution_Language,
      readme: request.resData.Problem_Statement
    };

    // Extract from DOM
    const solutionCode = request.resData.Solution_Code;

    // Save to GitHub
    const result = await repoManager.saveSolution(problemData, solutionCode);

    if (result.success) {
      console.log(`Solution saved to: ${result.path}`);
    } else {
      console.error(`Failed to save solution: ${result.error}`);
    }

    console.log("Codechef response");
    console.log(request);
  }
  else if (request.id === 'HrSoln' && !isProcessing) {
    isProcessing = true;

    const problemData = {
      platform: 'HrSoln',
      fileName: request.resData.Problem_Title,
      title: request.resData.Problem_Title,
      difficulty: request.resData.Problem_Difficulty,
      language: request.resData.Solution_Language,
      readme: request.resData.Problem_Statement
    };

    // Extract from DOM
    const solutionCode = request.resData.Solution_Code;

    // Save to GitHub
    const result = await repoManager.saveSolution(problemData, solutionCode);

    if (result.success) {
      console.log(`Solution saved to: ${result.path}`);
    } else {
      console.error(`Failed to save solution: ${result.error}`);
    }

    console.log("Hr Response");
    console.log(request);
  }
  else if (request.id === "LcSoln" && !isProcessing) {
    isProcessing = true;

    const problemData = {
      platform: 'LcSoln',
      fileName: request.resData.Problem_Title,
      title: request.resData.Problem_Title,
      difficulty: request.resData.Problem_Difficulty,
      language: request.resData.Solution_Language,
      readme: request.resData.Problem_Statement
    };

    // Extract from DOM
    const solutionCode = request.resData.Solution_Code;

    // Save to GitHub
    const result = await repoManager.saveSolution(problemData, solutionCode);

    if (result.success) {
      console.log(`Solution saved to: ${result.path}`);
    } else {
      console.error(`Failed to save solution: ${result.error}`);
    }

    console.log("Leetcode Response");
    console.log(request);
  }


  setInterval(() => {
    isProcessing = false;
    console.log(isProcessing);
    clearInterval()
  },
    5000
  )

});

//Web Scrapping part end