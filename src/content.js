// trying to hook into this from popup.js does not work since content.js is in browser tab page content and popup.js is in the popup window.
// function extractLicenseTerms() {
//   const terms = document.body.innerText.match(/(terms of service|license agreement|user agreement|privacy policy|terms and conditions)/i);
//   //console.log(document.body.innerText);
//   if (terms) {
//     alert("License Terms Found: " + terms[0]);
//   } else {
//     alert("No license terms found on this page.");
//   }
// }
  //extractLicenseTerms();
  console.log('adding message listener');

function fireDomainEvent(eventName) {
  chrome.runtime.sendMessage({ action: eventName }, response => {
    if (chrome.runtime.lastError) {
      console.error("Error sending message:", chrome.runtime.lastError);
    } else {
      console.log("Message sent to popup.js:", response);
    }
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.aoaiDetails) {
    console.log('Received AOAI Details');
    // Handle the received AOAI details here
    // For example, you can call a function to process the details
    processAoaiDetails(message.aoaiDetails);
  }
});

function processAoaiDetails(aoaiDetails) {
  // Implement your logic to handle the AOAI details here
  console.log('Processing AOAI Details');
  fireDomainEvent('extractLicenseTerms');
  const context = extractLicenseTerms();
  //console.log('Terms:', context);

  const response = callOpenAI(aoaiDetails.aoaiEndpoint, aoaiDetails.deploymentName, aoaiDetails.apiVersion, aoaiDetails.apiKey,context);
}

  //console.log('in content.js');

function extractLicenseTerms() {
  console.log('in extractLicenseTerms');
  const terms = document.body.innerText.match(/(terms of service|license agreement|user agreement|privacy policy|terms and conditions)/i);
  //console.log(document.body.innerText);
  if (terms) {
    //alert("License Terms Found: " + terms[0]);
    console.log("License Terms Found");
    return document.body.innerText;
    
  } else {
    alert("No license terms found on this page.");
  }
}

function callOpenAI(aoaiEndpoint, deploymentName, apiVersion, apiKey, context) {
  //"https://aoai-evaltest.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview"
  const endpoint = `${aoaiEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;
  const headers = {
    "Content-Type": "application/json",
    "api-key": apiKey,
  };
  const payload = {
    "messages": [
      {
        "role": "system",
        "content": [
          {
            "type": "text",
            "text": "You are an AI assistant that helps summarises information and highlights privacy concerns where personal data might sold, shared or distributed."
          }
        ]
      },
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "Can you summarise the privacy policy of this website provided in the context as succinctly as possible?" + 
                    "If there is any mention or potential risk of personal data being sold, shared or distributed,"+
                    "please highlight it and ensure this information is noted at the top of your summary. Context: " + context
          }
        ]
      }
    ],
    "temperature": 0.7,
    "top_p": 0.95,
    "max_tokens": 800
  }

  console.log('Calling OpenAI API:', endpoint);

  fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => {
    //console.log('OpenAI API response:', data);
    fireDomainEvent('end-extractLicenseTerms');
    alert(data.choices[0].message.content);
    // console.log("** SUMMARY **");
    // console.log(data.choices[0].message.content);

  })
  .catch(error => {
    console.error('Error calling OpenAI API:', error);
  });
  
};