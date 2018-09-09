// Application Name
window.appName = process.env.MIX_APP_NAME;

// Application URL
window.appUrl = process.env.MIX_APP_URL;

// Application Initials 
var initials = window.appName.match(/\b\w/g) || [];
window.appInitials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();

// Fetch Duration
window.fetchDuration = 3000

// Declare axios defaults
window.axios.defaults.baseURL = window.appUrl
window.axios.defaults.headers.common = {
	'Content-Type': 'application/json',
	'Accept': 'application/json',
	'Authorization': `Bearer ${User.token()}`
};