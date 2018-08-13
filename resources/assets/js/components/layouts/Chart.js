import React, { Component } from 'react';
import { Line , Bar} from 'react-chartjs-2'
import { NavLink } from 'react-router-dom';

export default class Chart extends Component {
	constructor(props) {
        super(props);
        this.state = {
          	monthFilter:'',
          	active:'today'

        }
		this.handleFilters = this.handleFilters.bind(this)
		this.handleMonthFilter = this.handleMonthFilter.bind(this)
    }	

	handleMonthFilter(e){
		this.setState({
			monthFilter:e.target.value
		})
	}

    handleFilters(value){
    	this.setState({
			active:value,
		})
    	this.props.handleFilterValue(value)
    }
	
    render() {
    	return (
			<div style={{height: '100%'}} className="row text-center justify-content-center px-3">		
				<div className="col-12 text-right">	
					<div className="btn-group btn-group-sm text-right mt-1 mb-2" role="group" aria-label="Filters">
						<button type="button" className={`${this.state.active == 'today' ? 'active' : ''} btn btn-success border border-white` } onClick={(e) => this.handleFilters('today', e )}>Today</button>
						<button type="button" className={ `${this.state.active == 'week' ? 'active': ''} btn btn-success border border-white`} onClick={(e) => this.handleFilters('week',e )}>This Week</button>
						<button type="button" className={ `${this.state.active == 'month' ? 'active': ''} btn btn-success border border-white`} onClick={(e) => this.handleFilters('month', e )}>This Month</button>
						<button type="button" className={ `${this.state.active == '3month' ? 'active': ''} btn btn-success border border-white`} onClick={(e) => this.handleFilters('3month', e )}>3 Months</button>
						<button type="button" className={ `${this.state.active == 'year' ? 'active': ''} btn btn-success border border-white`} onClick={(e) => this.handleFilters('year', e )}>This Year</button>
					</div>
				</div>	
				<div className="col-12 my-0">
					<Line
						data={ this.props.data }
						width={ 100 }
						height={ this.props.height }
						options={ this.props.options }
					/>		        	
				</div>
				<div className="col-12">
					<div className="row h-100 justify-content-center align-items-center">
						<div className="col-12">
							<small className="text-left font-weight-bold">Filter Data from x months ago</small>
							<div className="input-group input-group-sm">
								 <div className="input-group-prepend">
								 	<span className="input-group-text">Monthly Filter</span>
								 </div>
								<input type="number" className="form-control text-center" aria-label="Months" value={this.state.monthFilter} onChange={this.handleMonthFilter} />
								<div className="input-group-append">
									<button className="btn btn-info" type="button" onClick={(e) => this.handleFilters(this.state.monthFilter)}>Filter</button>
								</div>
							</div>						
						</div>
						<div className="col-12 my-2 text-center">
							<NavLink className="btn btn-sm btn-success" exact to={'/energy-reports'}>Generate Report</NavLink>			
						</div>
					</div>
				</div>
			</div>
    	)
    }
}