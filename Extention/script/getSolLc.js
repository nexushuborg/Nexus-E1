console.log("Script Injecting....");

setTimeout(() => {
  if (document.querySelector('span[data-e2e-locator="submission-result"]')?.textContent === "Accepted") {
    console.log("Accepted")
    const code = window.monaco?.editor?.getModels?.()[0]?.getValue();
    const ps = document.querySelector(
      ".elfjS"
    )?.innerText;
    const tags = document.querySelector('.overflow-hidden.transition-all')?.innerText.replace(/\n/g, ',').replace(/ /g, '');
    const psWithTag = (tags || "") + "\n\n" + (ps || "");
    const langButton = document
      .querySelector(
        'button[aria-haspopup="dialog"][data-state="closed"] svg[data-icon="chevron-down"]'
      )
      ?.closest("button");
    const lang = langButton?.childNodes[0]?.textContent?.trim();
    
    const title = document.querySelector('.no-underline.hover\\:text-blue-s.dark\\:hover\\:text-dark-blue-s.truncate.cursor-text.whitespace-normal.hover\\:\\!text-\\[inherit\\]')
      ?.innerText.replace(/^\d+\.\s/, '');
    
    const diff = document.querySelector('.relative.inline-flex.items-center.justify-center.text-caption.px-2.py-1.gap-1.rounded-full.bg-fill-secondary')?.innerText;

    const resData = {
      Problem_Title: title || "N/A",
      Problem_Statement: psWithTag || "N/A",
      Solution_Language: lang || "N/A",
      Solution_Code: code || "N/A",
      Problem_Difficulty: diff || "N/A",
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
  }
}, 8000);
