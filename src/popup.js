chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractLicenseTerms') {
    document.getElementById('content').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    console.log('Message received to extract license terms');
  }
  if (request.action === 'end-extractLicenseTerms') {
    document.getElementById('content').style.display = 'block';
    document.getElementById('spinner').style.display = 'none';
    console.log('Message received to extract license terms');
  }
  sendResponse('event message: [' + request.action + '] received');
//  return true;

});
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['oaiDetails'], (result) => {
    if (result.oaiDetails) {
      document.getElementById('aoaiEndpoint').value = result.oaiDetails.aoaiEndpoint;
      document.getElementById('deploymentName').value = result.oaiDetails.deploymentName;
      document.getElementById('apiVersion').value = result.oaiDetails.apiVersion;
      document.getElementById('apiKey').value = result.oaiDetails.apiKey;
      console.log('OAI details loaded');
    }
  });

  document.getElementById('extract').addEventListener('click', () => {
    console.log('hooking up click event');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log('hooking event to tab');
      const oaiDetails = getAoaiDetails();
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['popup.js']
  //      function: extractLicenseTerms
      }, () => {
        chrome.tabs.sendMessage(tabs[0].id, { aoaiDetails: oaiDetails  });
      });
    });
  })
  
});


function getAoaiDetails() {
  const aoaiEndpoint = document.getElementById('aoaiEndpoint');
  const deploymentName = document.getElementById('deploymentName');
  const apiVersion = document.getElementById('apiVersion');
  const apiKey = document.getElementById('apiKey');
  const oaiDetails = {
    aoaiEndpoint: aoaiEndpoint.value,
    deploymentName: deploymentName.value,
    apiVersion: apiVersion.value,
    apiKey: apiKey.value
  }

  chrome.storage.local.set({ oaiDetails: oaiDetails }, () => {
    console.log('OAI details saved');
  });

  return oaiDetails;
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
