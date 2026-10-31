// Emergency script to stop infinite loop
// Run this in the browser console to immediately stop the fetch loop

console.clear();
console.log('🚨 STOPPING INFINITE LOOP...');

// Override fetch to block the problematic user_profiles requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const url = args[0];
  
  // Block requests to user_profiles with the problematic ID
  if (typeof url === 'string' && url.includes('user_profiles') && url.includes('fc695f01-0a6a-4c1a-9788-028316bd8f5d')) {
    console.log('🚫 BLOCKED: Infinite loop fetch request', url);
    // Return a resolved promise with empty response to prevent errors
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ code: 'PGRST116', message: 'Blocked by emergency script' })
    });
  }
  
  // Allow other requests
  return originalFetch.apply(this, args);
};

console.log('✅ Infinite loop protection activated');
console.log('🔄 Please refresh the page to load the fixed code');

// Auto-refresh after 3 seconds
setTimeout(() => {
  console.log('🔄 Auto-refreshing to load fixed code...');
  window.location.reload();
}, 3000);
