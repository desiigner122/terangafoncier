// JSON Parsing Safety Utility
// Prevents "JSON.parse: unexpected character" errors

export const safeJSONParse = (jsonString, fallback = null) => {
  if (!jsonString || typeof jsonString !== 'string') {
    return fallback;
  }
  
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('SafeJSONParse: Failed to parse JSON:', {
      input: jsonString.substring(0, 100) + (jsonString.length > 100 ? '...' : ''),
      error: error.message
    });
    return fallback;
  }
};

export const safeJSONStringify = (data, fallback = '{}') => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.warn('SafeJSONStringify: Failed to stringify data:', error);
    return fallback;
  }
};

export const safeLocalStorageGet = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? safeJSONParse(item, fallback) : fallback;
  } catch (error) {
    console.warn(`SafeLocalStorage: Failed to get ${key}:`, error);
    return fallback;
  }
};

export const safeLocalStorageSet = (key, data) => {
  try {
    localStorage.setItem(key, safeJSONStringify(data));
    return true;
  } catch (error) {
    console.warn(`SafeLocalStorage: Failed to set ${key}:`, error);
    return false;
  }
};
