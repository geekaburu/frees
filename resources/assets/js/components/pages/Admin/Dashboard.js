import React, { Component } from 'react';
import { Line } from 'react-chartjs-2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom';

import DashboardCard from '../../layouts/DashboardCard'
import CountDownTimer from '../../layouts/CountDownTimer'
import KenyanMap from '../../layouts/KenyanMap'
import Loader from '../../layouts/Loader';
import Chart from '../../layouts/Chart'
import { chartData } from '../../../resources/ChartHelper'

export default class Dashboard extends Component {
	constructor(props) {
        super(props)
        this.state = {
            cards:{
            	energy:0,
            	credits:0,
            	amount:0,
            },
            chart: { datasets:[], labels:[], filter:'live' },
            rates:{
            	value:0,
            	credit_rate:0,
            },
            lastDate:'',
            counties:[],
            highestCards:{
            	county:{name:''},
            	customer:{name:''},
            	month:{month:'',energy:0.00}
            },
        }
        this.fetchData = this.fetchData.bind(this)
    }

	// Get data when the component loads
    componentDidMount(){
    	// Set loader to true
    	this.setState({loader:true})
    	// Fetch data
    	this.fetchData()
    	// Apply fetch duration
    	this.timerID = setInterval(
			() => this.fetchData(),
			App.fetchDuration(),
    	)      	
    }

	// Tear down the interval 
    componentWillUnmount() {
	    clearInterval(this.timerID);
	}

    fetchData(){
		axios.post('api/admin/dashboard-data')
    	.then((response) => {
    		this.setState({
    			loader:false,
    			cards:response.data.cards,
    			chart: chartData(response.data.chart, ['energy'], this.state.chart.filter),
    			lastDate: response.data.lastDate,
    			rates: response.data.rates,
    			counties: response.data.counties,
    			highestCards: response.data.highestCards,
    		})
    	})
    	.catch((error) => {
    		if(User.hasTokenHasExpired(error.response.data)){
    			this.props.history.push('/login')
    		}
    	})
    }

    render() {
    	const counties = this.state.counties.map((county, i) => (
    		<tr key={county.id}>
    			<td className="text-success font-weight-bold">{i+1}</td><td>{county.name}</td>
				<td>{parseFloat(!county.energy ? 0.00 : county.energy).toFixed(2)}</td>					
				<td>{parseFloat(!county.amount ? 0.00 : county.amount).toFixed(2)}</td>
				<td className="text-center">
					<NavLink to={`/admin/energy-reports/customers/all?county=${county.id}`}>
						<FontAwesomeIcon icon="eye" size="lg" className="mr-2 text-success" />
					</NavLink>
				</td>
    		</tr>
    	))
    	return (
			<div id="dashboard" className="row align-items-center justify-content-center m-0">
				<Loader load={this.state.loader} />  
				<div className="col-12">
					<div className="row justify-content-center">
						<div className="col-12 col-md-3 pl-0 pr-1">
							<DashboardCard icon='users' title='Number of Customers' text={this.state.cards ? this.state.cards.customers : 0} iconStyle='rgb(90, 178, 94)' />					
						</div>
						<div className="col-12 col-md-3 px-1">
							<DashboardCard icon='burn' title='Energy this Year' text={`${parseFloat(this.state.cards ? this.state.cards.energy : 0.00).toFixed(2)} kWh`}  iconStyle='rgb(254, 161, 29)' />					
						</div>
						<div className="col-12 col-md-3 px-1">
							<DashboardCard icon='credit-card' title='Credits this Year' text={parseFloat(this.state.cards ? this.state.cards.credits : 0.00).toFixed(2)}  iconStyle='rgb(231, 55, 115)' />					
						</div>
						<div className="col-12 col-md-3 px-1">
							<DashboardCard icon='hand-holding-usd' title='Amount Earned this Year' text={`KES ${parseFloat(this.state.cards ? this.state.cards.amount : 0.00).toFixed(2)}`}  iconStyle='rgb(17, 183, 204)' />
						</div>
					</div>
					<div className="row mt-2">
						<div className="col-12 card-shadow p-0 dashboard-card-side county-section">
							<div className="overlay"></div>
							<div className="row p-lg-5">
								<div className="col-12 col-lg-6 d-none d-lg-block">
									<KenyanMap />
								</div>
								<div style={{height:'420px', overflowY:'scroll'}} className="col-12 col-lg-6">
									<table className="dashboard-table table table-bordered table-striped table-hover table-sm">
										<thead className="thead-dark">
											<tr>
												<th style={{width:'10%'}}>#</th>
												<th style={{width:'30%'}}>County</th>
												<th style={{width:'25%'}}>Energy (Kwh)</th>
												<th style={{width:'25%'}}>Amount (KES)</th>
												<th style={{width:'10%'}}></th>												
											</tr>
										</thead>
										<tbody>
											{counties}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div className="row justify-content-center">
						<div className="col-12 col-md-3 pl-0 pr-1">
							<DashboardCard icon='building' title='Highest County' text={
								<div>
									{this.state.highestCards.county.name}
									<NavLink className="btn btn-sm btn-dark ml-2 p-1" to={`/admin/energy-reports/customers/all?county=${this.state.highestCards.county.id}`}>
										<small>View Data</small>
									</NavLink>
								</div>
							} iconStyle='rgb(254, 161, 29)' />					
						</div>
						<div className="col-12 col-md-3 pl-0 pr-1">
							<DashboardCard icon='trophy' title='Highest Customer' text={
								<div>
									{this.state.highestCards.customer.name}
									<NavLink className="btn btn-sm btn-dark ml-2 p-1" to={`/admin/energy-reports/customers/${this.state.highestCards.customer.id}`}>
										<small>View Data</small>
									</NavLink>
								</div>
							}  iconStyle='rgb(231, 55, 115)' />					
						</div>
						<div className="col-12 col-md-3 pl-0 pr-1">
							<DashboardCard icon='calendar-plus' title='Highest Month' text={this.state.highestCards.month.month} iconStyle='rgb(90, 178, 94)' />
						</div>
						<div className="col-12 col-md-3 pl-0 pr-1">
							<DashboardCard icon={['fab', 'react']} title='Highest Month Energy' text={`${parseFloat(this.state.highestCards.month.energy).toFixed(2)} Kwh`} iconStyle='rgb(17, 183, 204)' />					
						</div>
					</div>
					<div className="row justify-content-center mt-2">
						<div className="col-12 col-md-8 px-2 mt-2 mt-md-0">
							<div className="p-3" style={{boxShadow:'1px 1px 3px rgba(0, 0, 0, 0.4)'}}>
								<Chart
									data={ this.state.chart }
									height={ 300 }
									handleFilterValue={this.handleFilterValue}
									filters={[{label: 'Live', value:'live'}]}
									activeFilter='live'
									title='A Graph of Energy Against Time'
									axesLabels = {{
										yAxes:'Energy in kWh',
										'xAxes': 'Time'
									}}
								/>
							</div>
						</div>
						<div className="col-12 col-md-4 px-1 text-center mt-2 mt-md-0">
							<div className="col-12 p-0 mb-1 dashboard-card-side">
								<div className="overlay"></div>
								<div style={{height:'180px'}} className="row mx-0 px-3 align-items-center">
									<div className="col-12">
										<h5 className="my-3 font-weight-bold text-white">Current Rates</h5>
										<div className="row">
											<div className="col">
												<h6 className="text-success font-weight-bold">Carbon Price</h6>
												<h5 style={{backgroundColor:'rgb(231, 55, 115)'}} className="p-3 text-white font-weight-bold">KES {parseFloat(this.state.rates.value).toFixed(2)}</h5>
											</div>
											<div className="col">
												<h6 className="text-success font-weight-bold">Conversion Rate</h6>
												<h5 style={{backgroundColor:'rgb(17, 183, 204)'}} className="p-3 text-white font-weight-bold">1 Cr/{this.state.rates.credit_rate} kWh</h5>
											</div>
										</div>
									</div>
								</div>	
							</div>
							<div className="col-12 p-0 mb-1 dashboard-card-side">
								<div className="overlay"></div>
								<div style={{height:'180px'}} className="row mx-0 px-3 align-items-center">
									<div className="col-12">
										<h5 className="my-3 font-weight-bold text-white">Countdown to the next redemption</h5>	
										<CountDownTimer endDate={this.state.lastDate} />							
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
		    </div>
    	)
    }
}