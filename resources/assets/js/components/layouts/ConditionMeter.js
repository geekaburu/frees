import React, { Component } from 'react';

export default class ConditionMeter extends Component {
    render() {
    	return (
			<div style={{height:this.props.containerHeight}} className="row align-items-center justify-content-center">
    			<div className="col-10">
    				<div className="row">
			    		<div className="col-4 px-1 text-center">
			    			<div style={{height:this.props.barHeight}} className="progress progress-bar-vertical w-100">
						    	<div className="progress-bar progress-bar-striped progress-bar-animated bg-danger" role="progressbar" aria-valuenow={this.props.temperature} aria-valuemin="0" aria-valuemax="100" style={{height: this.props.temperature + '%'}}>{this.props.temperature}&#8451;</div>
						  	</div>
						    <small className="font-weight-bold">Temp</small>
			    		</div>
			    		<div className="col-4 px-1 text-center">
			    			<div style={{height:this.props.barHeight}} className="progress progress-bar-vertical w-100">
						    	<div className="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" aria-valuenow={this.props.humidity} aria-valuemin="0" aria-valuemax="100" style={{height: this.props.humidity + '%'}}>{this.props.humidity}%</div>
						  	</div>
						    <small className="font-weight-bold">Hum</small>
			    		</div>
			    		<div className="col-4 px-1 text-center">
			    			<div style={{height:this.props.barHeight}} className="progress progress-bar-vertical w-100">
						    	<div className="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" aria-valuenow={this.props.intensity} aria-valuemin="0" aria-valuemax="100" style={{height: this.props.intensity + '%'}}>{this.props.intensity}%</div>
						  	</div>
						    <small className="font-weight-bold">Int</small>
			    		</div>
    				</div>					
    			</div>
	    	</div>
    	)
    }
}