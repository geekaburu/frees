import React, { Component } from 'react'
import moment from 'moment';
import Select from 'react-select';
import { withRouter } from 'react-router-dom'

import Alert from '../../layouts/Alert'
import Chart from '../../layouts/Chart'
import Loader from '../../layouts/Loader'
import Picker from '../../layouts/Picker'
import { chartData } from '../../../resources/ChartHelper'

export default class Pricing extends Component {
	constructor(props) {
        super(props)
        this.state = {
        	chart: { datasets:[], labels:[], filter:'3month'}, 
        	upperBar: {
        		price:0.00,
        		rate:0.00,
        		avgPrice:0.00,
        		avgRate:0.00,
        	},       
        }
        this.fetchData = this.fetchData.bind(this)
        this.handleFilterValue = this.handleFilterValue.bind(this)
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
		axios.post('api/application/pricing', {
			chart_filter: this.state.chart.filter,	
		})
    	.then((response) => {	
    		var chart = chartData(response.data.prices.chart, ['price', 'rate'])
    		chart.filter = this.state.chart.filter
    		this.setState({
				loader:false,
				chart: chart,
				upperBar: {
	        		price:response.data.today.value,
	        		rate:response.data.today.credit_rate,
	        		avgPrice:response.data.prices.priceAverage ? response.data.prices.priceAverage : 0.00 ,
	        		avgRate:response.data.prices.rateAverage ? response.data.prices.rateAverage : 0.00 ,
	        	}
			})
    	})
    	.catch((error) => {
    		if(User.hasTokenHasExpired(error.response.data)){
    			this.props.history.push('/login')
    		}
    	})
	}
	
	handleFilterValue(value){
		this.setState({
			chart:{
				datasets:this.state.chart.datasets, 
				labels:this.state.chart.labels, 
				filter: value 
			}
		}, ()=>{
			this.fetchData()
		})
	}

	render() {
    	return (
			<div id="pricing" className="row m-0">
				<Loader load={this.state.loader} /> 
				<div className="col-12 card-shadow pt-2 pb-3">
					<div className="row m-0">						
						<div className="col-12 bg-dark-secondary text-white py-0">
							<div className="row">
								<div className="col border border-white py-2 font-weight-bold">
									Carbon Price Today: KES {parseFloat(this.state.upperBar.price).toFixed(2)}
								</div>
								<div className="col border border-white py-2 font-weight-bold">
									Carbon Rate Today: 1Cr/{this.state.upperBar.rate} kWh
								</div>
								<div className="col border border-white py-2 font-weight-bold">
									Average Price: KES {parseFloat(this.state.upperBar.avgPrice).toFixed(2)}
								</div>
								<div className="col border border-white py-2 font-weight-bold">
									Average Rate: 1Cr/{parseFloat(this.state.upperBar.avgRate).toFixed(2)} kWh
								</div>
							</div> 
						</div>				
					</div>
				</div>
				<div className="col-12 py-3 card-shadow mt-1">
					<Chart
						data={ this.state.chart }
						width={ 100 }
						height={ 430 }
						handleFilterValue={this.handleFilterValue}
						filters={[{label: 'This Week', value:'week'}, {label: 'This Month', value:'month'}, {label: 'Past 3 Months', value:'3month'}, {label: 'This Year', value:'year'}]}
						activeFilter='3month'
						title='Carbon Prices'
						axesLabels = {{
							yAxes:'Prices in KES',
							'xAxes': 'Time'
						}}
					/>
				</div>
		    </div>
    	)
    }
}