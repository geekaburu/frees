import React, { Component } from 'react'
export default class Helpers extends Component {
	constructor(props){
		super(props)
		this.fetchDuration = this.fetchDuration.bind(this)
		this.asset = this.asset.bind(this)
	}

	// Get fetch duration
	fetchDuration(){
		return window.fetchDuration
	}

	// Handle Error Display
	displayErrors(errors){
		let collection = errors.map(( error ) => (
			<li key={errors.indexOf(error)}>
				{error}
			</li>
		))

		// return the error collection
		return <ul>{collection}</ul>
	}

	// Get relative paths for assets
	asset(path){
		return `${window.appUrl}/${path}`
	}
} 