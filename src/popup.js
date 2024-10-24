

document.getElementById('extract').addEventListener('click', () => {
  console.log('hooking up click event');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log('hooking event to tab');
    const oaiDetails = getAoaiDetails();
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
//      function: extractLicenseTerms
    }, () => {
      chrome.tabs.sendMessage(tabs[0].id, { aoaiDetails: oaiDetails  });
    });
  });
})

function getAoaiDetails() {
  const aoaiEndpoint = document.getElementById('aoaiEndpoint');
  const deploymentName = document.getElementById('deploymentName');
  const apiVersion = document.getElementById('apiVersion');
  const apiKey = document.getElementById('apiKey');

  return {
    aoaiEndpoint: aoaiEndpoint.value,
    deploymentName: deploymentName.value,
    apiVersion: apiVersion.value,
    apiKey: apiKey.value
  }
}
  
  
console.log('in popup.js');

// This function is executed in the context of the browser tab (via chrome.scripting.executeScript) and not in the popup window.
// NOT popup.js and so when it is executed, it wont be in the same scope as popup.js and the getAoaiDetails() function will not be available.
// function extractLicenseTerms() {
//   console.log('in extractLicenseTerms');
//   const terms = document.body.innerText.match(/(terms of service|license agreement|user agreement|privacy policy|terms and conditions)/i);
//   //console.log(document.body.innerText);
//   if (terms) {
//     //alert("License Terms Found: " + terms[0]);
//     console.log("License Terms Found: " + terms[0]);
    
//   } else {
//     alert("No license terms found on this page.");
//   }
// }
