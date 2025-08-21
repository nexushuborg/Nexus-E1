(function () {
  let executed = false;

  function getSolutionCode() {
    try {
      const models = window.monaco?.editor?.getModels?.();
      if (models?.length) return models[0].getValue();
    } catch {}
    try {
      if (window.ace?.edit) {
        const aceEl = document.querySelector(".ace_editor");
        if (aceEl) return window.ace.edit(aceEl).getValue();
      }
    } catch {}
    return null;
  }

  function getProblemMetadata() {
    return {
      title: document.querySelector("[data-qa='challenge-name']")?.textContent?.trim() || document.title,
      difficulty: document.querySelectorAll(".pull-right")[1]?.textContent?.trim() || "N/A",
      description: document.querySelector(".hackdown-content")?.innerText?.trim() || "N/A",
      url: location.href,
    };
  }

  function logAccepted() {
    if (executed) return;
    executed = true;

    const payload = {
      metadata: getProblemMetadata(),
      solution: getSolutionCode(),
      timestamp: new Date().toISOString(),
    };

    // Send to extension (content.js)
    window.postMessage({ source: "HR-Extractor", payload }, "*");
  }

  const observer = new MutationObserver(() => {
    const congrats = document.querySelector("h6.congrats-heading");
    if (congrats && /congratulations/i.test(congrats.textContent || "")) {
      logAccepted();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  console.log("[HackerRank Extractor] Waiting for 'Congratulations message'...");
})();
