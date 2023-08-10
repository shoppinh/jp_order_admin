import { COOKIE_STORAGE_KEY } from '../utils/constants';

export const loadDocumentCookieState = () => {
  try {
    let serializedState = '';
    document.cookie.split(';').forEach(function (el) {
      let [key, value] = el.split('=');
      // cookie[key.trim()] = value;
      if (key.trim() === COOKIE_STORAGE_KEY) {
        serializedState = value;
      }
    });

    // const serializedState = document.cookie;
    if (serializedState === null || serializedState === '') {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveDocumentCookieState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    document.cookie = `${COOKIE_STORAGE_KEY}=${serializedState};path=/`;
    // localStorage.setItem(COOKIE_STORAGE_KEY, serializedState);
  } catch (err) {
    // Ignore write errors.
  }
};
