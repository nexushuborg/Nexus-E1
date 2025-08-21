// Inject pageScript.js into the actual page context
const script = document.createElement("script");
script.src = chrome.runtime.getURL("script/leetcode/pageScript.js");
(document.head || document.documentElement).appendChild(script);
script.onload = () => script.remove();
