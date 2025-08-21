function waitForMonaco() {
  return new Promise((resolve) => {
    const check = setInterval(() => {
      try {
        if (
          window.monaco &&
          window.monaco.editor &&
          window.monaco.editor.getModels().length > 0
        ) {
          clearInterval(check);
          resolve(true);
        }
      } catch (err) {
        console.error("[LeetCode Extractor] Monaco wait error:", err);
      }
    }, 500);
  });
}

//extract code
function getSolutionCode() {
  try {
    const models = window.monaco?.editor?.getModels?.();
    if (models && models.length > 0) {
      return models[0].getValue();
    }
  } catch (err) {
    console.error("[LeetCode Extractor] Error extracting code:", err);
  }
  return null;
}


// extract metadata 
function getProblemMetadata() {
  try {
    const title = document.querySelector("div[data-cy='question-title']")?.innerText || "N/A";
    const difficulty = document.querySelector("div.text-difficulty")?.innerText || "N/A";
    const description = document.querySelector("div[data-key='description-content']")?.innerText || "N/A";

    const acceptanceRateEl = Array.from(document.querySelectorAll("div")).find(el =>
      el.innerText?.includes("Acceptance")
    );
    const acceptanceRate = acceptanceRateEl?.innerText || "N/A";

    return { title, difficulty, acceptanceRate, description };
  } catch (err) {
    console.error("[LeetCode Extractor] Error extracting metadata:", err);
    return {};
  }
}


(async function initExtractor() {
  await waitForMonaco();
  console.log("[LeetCode Extractor] Ready, waiting for Accepted submissions...");

  let lastTriggered = false;

  const observer = new MutationObserver(() => {
    try {
      const banner = document.querySelector(
        'span[data-e2e-locator="submission-result"]'
      );

      if (banner && banner.textContent.trim() === "Accepted") {
        if (lastTriggered) return; 
        lastTriggered = true;

        const code = getSolutionCode();
        const metadata = getProblemMetadata();

        if (code) {

          const submissionData = {
            metadata,
            solution: code,
            timestamp: new Date().toISOString(),
          };

          console.log("[LeetCode Extractor] - Accepted submission detected!");
          console.log("[LeetCode Extractor] Submission JSON:", submissionData);
        } else {
          console.warn("[LeetCode Extractor] Monaco editor not ready.");
        }
      } else {
        lastTriggered = false;
      }
    } catch (err) {
      console.error("[LeetCode Extractor] Observer error:", err);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();