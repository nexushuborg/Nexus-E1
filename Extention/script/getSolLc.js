console.log("Script Injecting....");

// hold for the element to appear
function waitForElement() {
  const banner = document.querySelector(
    'div[data-e2e-locator="console-result"]'
  );

  if (banner && banner.textContent.trim() === "Accepted") {
    const code = window.monaco?.editor?.getModels?.()[0]?.getValue();
    const ps = document.querySelector(
      "div.flex.w-full.flex-1.flex-col.gap-4.overflow-y-auto.px-4.py-5"
    ).innerText;
    const langButton = document
      .querySelector(
        'button[aria-haspopup="dialog"][data-state="closed"] svg[data-icon="chevron-down"]'
      )
      .closest("button");
    const lang = langButton?.childNodes[0]?.textContent?.trim();

    const resData = {
      Problem_Statement: ps || "N/A",
      Solution_Language: lang || "N/A",
      Solution_Code: code,
    };

    const payload = {
      id: "LcSoln",
      resData: resData,
    };

    const event = new CustomEvent("DataSend", {
      detail: payload,
    });

    window.dispatchEvent(event);
    console.log("Sending message Lc");

    return true; 
  }
  return false; 
}

// Try as soon as the element appears
if (!waitForElement()) {
  const interval = setInterval(() => {
    if (waitForElement()) {
      clearInterval(interval);
    }
  }, 500);

  // Stop tryin
  setTimeout(() => clearInterval(interval), 10000);
}
