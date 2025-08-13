const sendBtn = document.getElementById('sendBtn');
const statusEl = document.getElementById('status');

// This function finds the specific element and returns its HTML.
function getGfgCode() {
  const targetElement = document.querySelector('#codePrettyPrint');
  if (targetElement) {
    console.log(targetElement.textContent);
    return targetElement.textContent;
  } else {
    return null;
  }
}

function leetcodeCode() {
  const targetElement = document.querySelector('pre code');
  if (targetElement) {
    console.log(targetElement.textContent);
    return targetElement.textContent;
  } else {
    return null;
  }
}


sendBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    statusEl.textContent = 'Finding element...';
    sendBtn.disabled = true;
    const url = tab.url;
   console.log(url);
   
    let title = '';
    let injectionResults = [];
    let postUrl = '';
    let exeFunction = '';
    try {

        if (url.includes("https://www.geeksforgeeks.org/problems")) {
            postUrl = 'http://localhost:8000/gfg';
            exeFunction = getGfgCode;   
            const regex = /problems\/([a-z0-9-]+)\//;
            const match = url.match(regex);
            if (match) {
              title = JSON.stringify(match[1]);
               // Outputs: missing-number-in-array1416
            }

        } 
        else if(url.includes("https://leetcode.com/problems")){
          postUrl = 'http://localhost:8000/leetcode';
          exeFunction = leetcodeCode;
           const regex = /problems\/([a-z0-9-]+)\//;
            const match = url.match(regex);
            if (match) {
              title = JSON.stringify(match[1]);
            }
          
        }

    injectionResults = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: exeFunction,
      }); 

      console.log(injectionResults);
      
      const htmlContent = injectionResults[0].result;

      if (!htmlContent) {
        throw new Error('Element not found.');
      }

      // The compression step is now removed.
      statusEl.textContent = 'Sending...';

      const response = await fetch(postUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/html'
        },
        body: JSON.stringify({
          title: title,
          code: htmlContent,
        }) // Send the original HTML string.
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backend response:', data);
      statusEl.textContent = 'Success!';
      statusEl.style.color = 'green';

    } catch (error) {
      console.error('Error in popup script:', error);
      statusEl.textContent = `Error: ${error.message}`;
      statusEl.style.color = 'red';
    } finally {
      sendBtn.disabled = false;
    }
  }
});

