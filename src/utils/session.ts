const getSessionStorage = (key: string) => {
  const saved = sessionStorage.getItem(key);

  if (saved) {
    return JSON.parse(saved);
  }
};

const setSessionStorage = (key: string, value:any) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

const removeSessionStorage = (key: string) => {
  sessionStorage.removeItem(key);
};

const getLocalStorage = (key: string) => {
  const saved = localStorage.getItem(key);

  if (saved) {
    return JSON.parse(saved);
  }
};

const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export {
  getSessionStorage,
  setSessionStorage,
  removeSessionStorage,
  setLocalStorage,
  getLocalStorage,
};
