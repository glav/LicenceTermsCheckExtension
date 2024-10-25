chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse('event message: [' + request.action + '] received');
  if (request.action === 'extractLicenseTerms') {
    toggleSpinner(true);
    console.log('Message received to extract license terms');
  }
  if (request.action === 'end-extractLicenseTerms') {
    toggleSpinner(false);
    console.log('Message received to end-extract license terms');
    showResults(request.data); 
  }
  if (request.action === 'error') {
    toggleSpinner(false);
    alert('An error occurred. Configuration values may be incorrect or too many requests.');
  }
});

function toggleSpinner(showSpinner) {
  if (showSpinner === true) {
    document.getElementById('content').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('results').style.display = 'none';
  } else {
    document.getElementById('content').style.display = 'block';
    document.getElementById('spinner').style.display = 'none';
  }
}

function showResults(results) {
  const el = document.getElementById('results');
  el.innerHTML = results;
  el.style.display = 'block';

}

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
        toggleSpinner(false);
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
  
