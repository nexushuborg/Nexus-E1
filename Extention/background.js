let submissionCaptured = false; // Flag to stop after first success
let resetTimeout = null; // Store timeout ID
let lastHackerrankData = null; // Store last submission for popup requests

chrome.webRequest.onCompleted.addListener(
  async (details) => {
    try {
      // Prevent duplicate captures within cooldown period
      if (submissionCaptured) return;

      const url = details.url;

      // Match submission API endpoint
      const match = url.match(/\/submissions\/(\d+)/);
      if (match) {
        console.log('📡 Fetched submission URL:', url);

        const response = await fetch(url, {
          credentials: "include", // Use same cookies/session as browser
        });

        if (!response.ok) {
          console.warn("⚠️ Fetch failed:", response.status);
          return;
        }

        const data = await response.json();

        if (data.model && data.model.code) {
          submissionCaptured = true; // Prevent further captures temporarily
          console.log("✅ HackerRank submission captured:", data.model);

          // Send to backend
          await fetch("http://localhost:8000/hackerrank", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data.model),
          });

          // Reset capture flag after delay
          if (resetTimeout) clearTimeout(resetTimeout);
          resetTimeout = setTimeout(() => {
            submissionCaptured = false;
            console.log("🔄 Capture flag reset — ready for next submission.");
          }, 5000);
        }
      }
    } catch (err) {
      console.error("❌ Error capturing submission:", err);
    }
  },
  { urls: ["https://www.hackerrank.com/rest/contests/*/submissions/*"] }
);
