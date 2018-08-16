import React, { Component } from 'react';

export default class ConditionMeter extends Component {
    render() {
    	return (
			<div style={{height:this.props.containerHeight}} className="row align-items-center justify-content-center">
    			<div className="col-10">
    				<div className="row">
			    		<div className="col-4 px-1 text-center">
			    			<div style={{height:this.props.barHeight}} className="progress progress-bar-vertical w-100">
						    	<div className="progress-bar progress-bar-striped progress-bar-animated bg-danger" role="progressbar" aria-valuenow={this.props.voltage} aria-valuemin="0" aria-valuemax="100" style={{height: (this.props.voltage/6*100) + '%'}}>{this.props.voltage} V</div>
						  	</div>
						    <small className="font-weight-bold">Voltage</small>
			    		</div>
			    		<div className="col-4 px-1 text-center">
			    			<div style={{height:this.props.barHeight}} className="progress progress-bar-vertical w-100">
						    	<div className="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" aria-valuenow={this.props.power} aria-valuemin="0" aria-valuemax="100" style={{height: (this.props.power/1.3*100) + '%'}}>{this.props.power} W</div>
						  	</div>
						    <small className="font-weight-bold">Power</small>
			    		</div>
			    		<div className="col-4 px-1 text-center">
			    			<div style={{height:this.props.barHeight}} className="progress progress-bar-vertical w-100">
						    	<div className="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" aria-valuenow={this.props.energy} aria-valuemin="0" aria-valuemax="100" style={{height: (this.props.energy/17*100) + '%'}}>{this.props.energy} Ws</div>
						  	</div>
						    <small className="font-weight-bold">Energy</small>
			    		</div>
    				</div>					
    			</div>
	    	</div>
    	)
    }
}