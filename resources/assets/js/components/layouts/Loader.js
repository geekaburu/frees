import React, { Component } from 'react';

export default class Loader extends Component {
    render() {
    	return (
			<div className={`${this.props.load ? 'd-block' : 'd-none'} loader-backdrop`}>
		 		<div className="loader position-fixed w-100">
					<img className="mx-auto d-block" src={App.asset('img/loaders/wedges.svg')} alt="" /> 
		 	  	</div>
		 	</div>
    	)
    }
}