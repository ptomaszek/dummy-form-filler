

const loadOptions = () => {
  chrome.storage.sync.get(
    DEFAULT_OPTIONS,
    (items) => {
      document.getElementById('textCharactersPool').value = items.textCharactersPool;
      document.getElementById('textStrategy').value = items.textStrategy;
      document.getElementById('password').value = items.password;
      document.getElementById('loggingEnabled').checked = items.loggingEnabled;
    }
  );
};

const saveOptions = () => {
  chrome.storage.sync.set(
    {
        textCharactersPool: document.getElementById('textCharactersPool').value,
        textStrategy: document.getElementById('textStrategy').value,
        password: document.getElementById('password').value,
        loggingEnabled: document.getElementById('loggingEnabled').checked
    },
    () => {
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 1250);
    }
  );
};

const resetDefaultOptions = () => {
    document.getElementById('textCharactersPool').value = DEFAULT_OPTIONS.textCharactersPool;
    document.getElementById('textStrategy').value = DEFAULT_OPTIONS.textStrategy;
    document.getElementById('password').value = DEFAULT_OPTIONS.password;
    document.getElementById('loggingEnabled').checked = DEFAULT_OPTIONS.loggingEnabled;
};

const exit = () => {
    window.close();
};

document.addEventListener('DOMContentLoaded', loadOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('exit').addEventListener('click', exit);
document.getElementById('reset').addEventListener('click', resetDefaultOptions);
