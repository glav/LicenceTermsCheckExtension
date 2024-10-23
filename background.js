chrome.action.onClicked.addListener((tab) => {

    console.log('4');
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  });
  
  console.log('3');
  
  