  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("script/hackerrank/pageScript.js");
  script.onload = function () {
    this.remove(); // cleanup after load
  };
  (document.head || document.documentElement).appendChild(script);

  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (event.data?.source === "HR-Extractor") {
      console.log("[Extension] Got submission:", event.data.payload);

      // Forward to background.js
      chrome.runtime.sendMessage({
        id: "HrSoln",   
        data: event.data.payload
      });
    }
  });
