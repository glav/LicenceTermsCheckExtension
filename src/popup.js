document.getElementById('extract').addEventListener('click', () => {
    console.log('hooking up click event');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log('hooking event to tab');
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: extractLicenseTerms
      });
    });
  });
  
  function extractLicenseTerms() {
    const terms = document.body.innerText.match(/(terms of service|license agreement|user agreement|privacy policy|terms and conditions)/i);
    //console.log(document.body.innerText);
    if (terms) {
      alert("License Terms Found: " + terms[0]);
    } else {
      alert("No license terms found on this page.");
    }
  }
  
  console.log('1');