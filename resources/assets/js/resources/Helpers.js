export default class Helpers {
	constructor(){
		this.asset = this.asset.bind(this)
	}

	// Get relative paths for assets
	asset(path){
		return `${window.appUrl}/${path}`
	}
} 