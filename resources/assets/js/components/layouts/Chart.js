import React, { Component } from 'react';
import { Line,Bar } from 'react-chartjs-2'
import { NavLink } from 'react-router-dom';
import { displayUnit, displayParser } from '../../resources/ChartHelper'

export default class Chart extends Component {
	constructor(props) {
        super(props);
        this.state = {
          	active:'',
        }
		this.handleFilters = this.handleFilters.bind(this)
    }

    componentWillMount(){
    	this.setState({
    		active:this.props.activeFilter,
    		data:this.props.data
    	})
    }	
    
    handleFilters(value){
    	this.setState({
			active:value,
		})
    	this.props.handleFilterValue(value)
    }
	
    render() {
    	const filters = this.props.filters && this.props.filters.map((filter, index) => (
    		<span key={index}>
	    		<button type="button" className={`${this.state.active == filter.value ? 'active' : ''} btn btn-success border border-white btn-sm rounded-0` } onClick={(e) => this.handleFilters(filter.value, e )}>{filter.label}</button>			
    		</span>
    	))
    	return (
			<div style={{height: '100%'}} className="row text-center justify-content-center px-3">		
				<div className="col-12 text-right">	
					<div className="btn-group btn-group-sm text-right mt-1 mb-2" role="group" aria-label="Filters">
						{filters}
					</div>
				</div>	
				<div className="col-12 my-0">
					<Bar
						data={ this.props.data }
						width={ 100 }
						height={ this.props.height }
						options = {{
							maintainAspectRatio: false,
							legend: {
					            display: true,
					            position: 'bottom',
					        },
							title: {
					            display: true,
					            text: this.props.title
					        },
					        scales: {
					            yAxes: [{
					            	scaleLabel: {
							        	display: true,
							        	labelString: this.props.axesLabels.yAxes,
							        	fontColor:'rgba(4, 33, 47, 1)',
							      	}
							    }],
							    xAxes: [{
							    	type:'time',
				                    time:{
				                    	unit: displayUnit(this.state.active),
				                        parser: displayParser(this.state.active),
				                        tooltipFormat: 'll',
				                    },
					            	scaleLabel: {
							        	display: true,
							        	labelString: this.props.axesLabels.xAxes,
							        	fontColor:'rgba(4, 33, 47, 1)',
							      	}
							    }]
					        }
						}}
					/>		        	
				</div>
			</div>
    	)
    }
}