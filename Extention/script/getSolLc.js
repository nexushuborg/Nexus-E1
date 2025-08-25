console.log("Script Injecting....");

  if (document.querySelector('.text-green-s.dark\\:text-dark-green-s.flex.flex-1.items-center.gap-2.text-\\[16px\\].font-medium.leading-6 span').innerText === "Accepted") {
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
      
    const title = document.querySelector('.no-underline.hover\\:text-blue-s.dark\\:hover\\:text-dark-blue-s.truncate.cursor-text.whitespace-normal.hover\\:\\!text-\\[inherit\\]').innerText.replace(/^\d+\.\s/, '')
    
      const diff = document.querySelector('.relative.inline-flex.items-center.justify-center.text-caption.px-2.py-1.gap-1.rounded-full.bg-fill-secondary').innerText;

      const resData = {
      Problem_Title: title,
      Problem_Statement: ps || "N/A",
      Solution_Language: lang || "N/A",
      Solution_Code: code,
      Problem_Difficulty: diff,
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