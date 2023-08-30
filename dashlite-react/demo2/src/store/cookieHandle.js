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
    console.log('JSON.parse(serializedState);', JSON.parse(serializedState));

    // const serializedState = document.cookie;
    if (serializedState === null || serializedState === '') {
      return undefined;
    }
    console.log('JSON.parse(serializedState);', JSON.parse(serializedState));
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
