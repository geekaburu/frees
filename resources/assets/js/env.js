// Application Name
window.appName = document.head.querySelector('meta[name="app-name"]').content;

// Application URL
window.appUrl = document.head.querySelector('meta[name="app-url"]').content

// Application Initials 
var initials = window.appName.match(/\b\w/g) || [];
window.appInitials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();

// Fetch Duration
window.fetchDuration = 2000

// Declare axios defaults
window.axios.defaults.baseURL = window.appUrl
window.axios.defaults.headers.common = {
	'Content-Type': 'application/json',
	'Accept': 'application/json',
	'Authorization': `Bearer ${User.token()}`
};