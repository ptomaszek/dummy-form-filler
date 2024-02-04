"use strict";

console.log('loaded content script');

browser.runtime.onMessage.addListener((request) => {
  console.log("Message from the background script:");
  console.log(request.greeting);
  return Promise.resolve({ response: "Hi from content script" });
});
