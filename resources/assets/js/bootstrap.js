window._ = require('lodash');
window.Popper = require('popper.js').default;
import Echo from "laravel-echo"

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */
 
try {
    window.$ = window.jQuery = require('jquery');
    require('bootstrap');
} catch (e) {}


window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'd6c51594469d76d0e8f4',
    cluster: 'ap2',
    encrypted: true
});

// Import the authentication service
import AuthService from './resources/AuthService'
import Helpers from './resources/Helpers'
window.User = new AuthService()
window.App = new Helpers()
window.axios = require('axios')