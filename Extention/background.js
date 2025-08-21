
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
      target: {tabId: details.tabId},
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
    