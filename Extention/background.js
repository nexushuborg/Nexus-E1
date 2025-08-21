chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  console.log(chrome.storage.local);
});

// login
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "authWithGitHub") {

    chrome.storage.local.get(["username", "jwt"], (stored) => {
      if (stored.username && stored.jwt) {
        console.log(`Already logged in as ${stored.username}`);
        sendResponse({
          message: "You are already logged in",
          username: stored.username,
          avatarUrl: stored.avatarUrl
        });
        return; // stop here
      }
    })

    const redirectURL = chrome.identity.getRedirectURL();
    const state = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
    //save `state`
    chrome.storage.session.set({ oauthState: state });
    console.log("redirect url is " + redirectURL);

    chrome.identity.launchWebAuthFlow({
      url: `https://github.com/login/oauth/authorize?client_id=Ov23limgwxLHCgCu5kmJ&redirect_uri=${encodeURIComponent(redirectURL)}&state=${state}&scope=${encodeURIComponent("read:user repo")}`,
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
    });

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

function checkEvent() {
  console.log('listening to event');
  window.addEventListener('DataSendGfg', (e) => {
    console.log(e.detail);
    chrome.runtime.sendMessage({
      id: e.detail.id,
      resData: e.detail.resData
    })
  })
}

const GFG_SUBMIT_URL = 'https://practiceapiorigin.geeksforgeeks.org/api/latest/problems/submission/submit/result/';
const CODECHEF_SUBMIT_URL = 'https://www.codechef.com/api/ide/submit';

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

    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      func: checkEvent
    });

    if (scriptToInject && details.tabId > 0) {
      setTimeout(() => {
        chrome.scripting.executeScript({
          target: { tabId: details.tabId },
          files: [scriptToInject],
          world: 'MAIN'
        });
      }, 1500);
    }
  },
  {
    urls: [
      "https://practiceapiorigin.geeksforgeeks.org/*",
      "https://www.codechef.com/api/ide/submit*"
    ]
  }
);

chrome.runtime.onMessage.addListener((request, sender, sendRes) => {

  //debug
  console.log('Received the message', request.id);

  if (request.id === 'GfgSoln') {
    console.log("GFG response");
    console.log(request);
  }
  else if (request.id === 'CfSoln')
    console.log("Codechef response");
  console.log(request);

});
