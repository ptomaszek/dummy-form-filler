console.log('Loaded DummyFormFiller content scripts');

chrome.runtime.onMessage.addListener((request) => {
  try {
      console.log('Run Dummy Form Filler');
      DummyFormFiller.populateDummyData();
  } catch (e) {
      console.error('Cannot run Dummy Form Filler - raise an issue on https://github.com/ptomaszek/dummy-form-filler/issues');
      console.error(e);
  }
});
