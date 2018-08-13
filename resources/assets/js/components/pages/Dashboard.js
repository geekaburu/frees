import React, { Component } from 'react';
import { Line } from 'react-chartjs-2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import DashboardCard from '../layouts/DashboardCard'
import CountDownTimer from '../layouts/CountDownTimer'
import { chartData } from '../../resources/ChartHelper'
import Loader from '../layouts/Loader';

export default class Dashboard extends Component {
	constructor(props) {
        super(props)
        this.state = {
            cards:{
            	energy:0,
            	credits:0,
            	amount:0,
            },
            chart:{},
            rates:{
            	value:0,
            	credit_rate:0,
            },
            lastDate:''
        }
        this.fetchData = this.fetchData.bind(this)
    }

	// Get data when the component loads
    componentDidMount(){
    	this.fetchData()      	
    }

    fetchData(){
    	this.setState({
            loader:true,
    	},() =>{
    		axios.post('api/customers/dashboard-data')
	    	.then((response) => {
	    		this.setState({
	    			loader:false,
	    			cards:response.data.cards,
	    			chart: chartData(response.data.chart, ['energy']),
	    			lastDate: response.data.lastDate,
	    			rates: response.data.rates,
	    		})
	    	})
	    	.catch((error) => {
	    		if(User.hasTokenHasExpired(error.response.data)){
	    			this.props.history.push('/login')
	    		}
	    	})
    	})
    }
    render() {
    	return (
			<div id="dashboard" className="row align-items-center justify-content-center">
				<Loader load={this.state.loader} />  
				<div className="col-12 px-4">
					<div className="row justify-content-center">
						<div className="col-12 col-md-3 px-1">
							<DashboardCard icon='qrcode' title='Number of Panels' text={this.state.cards.panels}  iconStyle='rgb(90, 178, 94)' />				
						</div>
						<div className="col-12 col-md-3 px-1">
							<DashboardCard icon='burn' title='Energy this Year' text={`${this.state.cards.energy.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits:2 })} kWh`}  iconStyle='rgb(254, 161, 29)' />					
						</div>
						<div className="col-12 col-md-3 px-1">
							<DashboardCard icon='credit-card' title='Credits this Year' text={this.state.cards.credits.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits:2 })}  iconStyle='rgb(231, 55, 115)' />					
						</div>
						<div className="col-12 col-md-3 px-1">
							<DashboardCard icon='hand-holding-usd' title='Amount Earned this Year' text={`KES ${this.state.cards.amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits:2 })}`}  iconStyle='rgb(17, 183, 204)' />
						</div>
					</div>
					<div className="row justify-content-center mt-2">
						<div className="col-8 px-2">
							<div className="p-3" style={{boxShadow:'1px 1px 3px rgba(0, 0, 0, 0.4)'}}>
								<Line
									data={ this.state.chart }
									width={100}
									height={330}
									options={{
										maintainAspectRatio: false,
										legend: {
								            display: true,
								            position: 'bottom',
								        },
										title: {
								            display: true,
								            text: 'Energy Readings this Month'
								        },
								        scales: {
								            yAxes: [{
								            	scaleLabel: {
										        	display: true,
										        	labelString: 'Energy in kWh',
										        	fontColor:'rgba(4, 33, 47, 1)',
										      	}
										    }],
										    xAxes: [{
								            	scaleLabel: {
										        	display: true,
										        	labelString: 'Time',
										        	fontColor:'rgba(4, 33, 47, 1)',
										      	}
										    }]
								        }
									}}
								/>
							</div>
						</div>
						<div className="col-4 px-1 text-center">
							<div className="col-12 p-0 mb-1 dashboard-card-side">
								<div className="overlay"></div>
								<div style={{height:'180px'}} className="row mx-0 px-3 align-items-center">
									<div className="col-12">
										<h5 className="my-3 font-weight-bold text-white">Current Rates Today</h5>
										<div className="row">
											<div className="col">
												<h6 className="text-success font-weight-bold">Carbon Price</h6>
												<h5 style={{backgroundColor:'rgb(231, 55, 115)'}} className="p-3 text-white font-weight-bold">KES {this.state.rates.value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits:2 })}</h5>
											</div>
											<div className="col">
												<h6 className="text-success font-weight-bold">Conversion Rate</h6>
												<h5 style={{backgroundColor:'rgb(17, 183, 204)'}} className="p-3 text-white font-weight-bold">1 Cr/{this.state.rates.credit_rate}kWh</h5>
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