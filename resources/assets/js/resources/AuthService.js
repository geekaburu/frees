export default class AuthService {
	constructor(){
		this.data = this.data.bind(this)
		this.token = this.token.bind(this)
		this.role = this.role.bind(this)
		this.isLoggedIn = this.isLoggedIn.bind(this)
		this.logout = this.logout.bind(this)
		this.homepage = this.homepage.bind(this)
		this.setToken = this.setToken.bind(this)
		this.hasTokenHasExpired = this.hasTokenHasExpired.bind(this)
	}

	// Set the token into the local storage
	setToken(data){
		localStorage.setItem('userData', JSON.stringify(data))
		axios.defaults.headers.common.Authorization = `Bearer ${this.token()}`
	}

	// Get the current logged in user data
	data(){
		return JSON.parse(localStorage.getItem('userData')) ? JSON.parse(localStorage.getItem('userData')).user : '' 
	}

	// Get the current logged in user authentication token
	token(){
		return JSON.parse(localStorage.getItem('userData')) ? JSON.parse(localStorage.getItem('userData')).token : '' 
	}

	// Get the current logged in user role
	role(){
		return JSON.parse(localStorage.getItem('userData')) ? JSON.parse(localStorage.getItem('userData')).role : '' 
	}

	// Get the current logged in user's default homepage
	homepage(){
		return this.role() == 'solar_company' ? '/admin' : '/'
	}

	// Check if user is logged in
	isLoggedIn(){
		return JSON.parse(localStorage.getItem('userData')) ? true : false 
	}

	// Logout the authenticated user
	logout(){
		localStorage.removeItem('userData') 
	}

	// Logout the authenticated user
	hasTokenHasExpired(error){
		if(error.message == 'The token has expired.'){
			this.logout()
			return true
		}
		return false
	}
} 