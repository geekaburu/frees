import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Chart from '../layouts/Chart'
import Loader from '../layouts/Loader';
import DashboardCard from '../layouts/DashboardCard'
import CountDownTimer from '../layouts/CountDownTimer'
import { chartData } from '../../resources/ChartHelper'

export default class Dashboard extends Component {
	constructor(props) {
        super(props)
        this.state = {
            cards:{
            	energy:0,
            	credits:0,
            	amount:0,
            	panels:0,
            },
            chart: { datasets:[], labels:[], filter:'live' },
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
		axios.post('api/customers/dashboard-data')
    	.then((response) => {
    		this.setState({
    			loader:false,
    			cards:response.data.cards,
    			chart: chartData(response.data.chart, ['energy'], this.state.chart.filter),
    			lastDate: response.data.lastDate,
    			rates: response.data.rates,
    		})
    	})
    	.catch((error) => {
    		if(User.hasTokenHasExpired(error.response.data)){
    			this.props.history.push('/login')
    		}
    	})
    }
    render() {
    	return (
			<div id="dashboard" className="row align-items-center justify-content-center">
				<Loader load={this.state.loader} />  
				<div className="col-12 px-4">
					<div className="row justify-content-center">
						<div className="col-12 col-md-3 px-1">
							<DashboardCard icon='qrcode' title='Number of Panels' text={this.state.cards ? this.state.cards.panels : 0}  iconStyle='rgb(90, 178, 94)' />				
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
										<h5 className="my-3 font-weight-bold text-white">Current Rates Today</h5>
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