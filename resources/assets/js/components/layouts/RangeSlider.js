import React, { Component } from 'react';

export default class RangeSlider extends Component {
	constructor(props) {
        super(props);
        this.handleRangeIncrease = this.handleRangeIncrease.bind(this)
    }	
	
	handleRangeIncrease(event){
		return this.props.rangeIncrease(event.target.value)
	}

    render() {
    	return (
			<div className="slidecontainer">
				<input disabled = {this.props.disabled} type="range" min={this.props.min} max={this.props.max} value={this.props.angle} onChange={this.handleRangeIncrease} step="1" className="slider" />
			</div>
    	)
    }
}