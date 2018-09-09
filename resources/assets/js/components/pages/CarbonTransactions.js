import React, { Component } from 'react';
import DataTable from '../layouts/DataTable'
import { Bar } from 'react-chartjs-2'
import Loader from '../layouts/Loader';

export default class CarbonTransactions extends Component {
	constructor(props) {
        super(props)
        this.state = {
            transactions:'',
            energyChart: { datasets:[], labels:[] },
            amountChart: { datasets:[], labels:[] },
            upperBar: {
            	price: 0, 
            	energy: 0,
            	credits: 0,
            	amount: 0 
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
    }

	// Tear down the interval 
    componentWillUnmount() {
	    clearInterval(this.timerID);
	}

	fetchData(){
		axios.post('api/customers/carbon-transactions', {})
    	.then((response) => {
    		this.setState({
    			loader:false,
    			transactions: {
    				data:response.data,
    				columns: [
						{ title: 'Year', data: 'year' },
	            		{ title: 'Energy (Kwh)', data: 'energy' },
	            		{ title: 'Price', data: 'price' },
	            		{ title: 'Credits', data: 'credits' },
	            		{ title: 'Amount (Ksh)', data: 'amount' },
	            		{ title: 'Status', data: 'status' },
	            		{ title: 'Receipt Date', data: 'receipt_date' },
	    			]
    			},
    			energyChart: { 
    				datasets:response.data.map(function(e) { return e.energy}), 
    				labels:response.data.map(function(e) { return e.year}),
    			},
            	amountChart: { 
            		datasets:response.data.map(function(e) { return e.amount}), 
            		labels:response.data.map(function(e) { return e.year}),
            	},	
            	upperBar: response.data.slice(-1)[0] 		
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
			<div className="row align-items-center justify-content-center m-0">
				<Loader load={this.state.loader} />  
				<div className="col-12 card-shadow pt-2 pb-3">
					<small className="font-weight-bold mb-2">Values as at {(new Date()).toLocaleDateString('en-GB')}</small>
					<div className="row m-0">						
						<div className="col-12 bg-dark-secondary text-white py-0">
							<div className="row">
								<div className="col-12 col-lg border border-white py-2 font-weight-bold">
									Carbon Price: KES {parseFloat(this.state.upperBar.price).toFixed(2)}
								</div>
								<div className="col-12 col-lg border border-white py-2 font-weight-bold">
									Energy: {parseFloat(this.state.upperBar.energy).toFixed(2)} KWh
								</div>
								<div className="col-12 col-lg border border-white py-2 font-weight-bold">
									Credits: {parseFloat(this.state.upperBar.credits).toFixed(2)}
								</div>
								<div className="col-12 col-lg border border-white py-2 font-weight-bold">
									Amount: KES {parseFloat(this.state.upperBar.amount).toFixed(2)}
								</div>
							</div> 
						</div>				
					</div>
				</div>
				<div className="col-12 py-3 card-shadow mt-1">
					{ this.state.transactions.columns 
						? <DataTable 
							data={this.state.transactions.data}
							columns={this.state.transactions.columns}
							defs={[{
				                'render': function ( data, type, row ) {
				                    return parseFloat(data).toFixed(2);
				                },
					                'targets': [1,2,3,4]
					            }
					        ]}
							order={[[ 0, 'desc' ]]}
							sumColumns={[1,2,4]}
							withFooter={true} 
						/>
						: '' 
					}
				</div>
				<div className="col-12 col-lg-6 mt-1 pr-4">
					<div className="row">
						<div className="col-12 card-shadow py-3" style={{height:'300px'}}>
							<Bar
								data={{
									labels: this.state.energyChart.labels,
							        datasets: [{
								        label: "Energy Generated in Kwh",
								        backgroundColor: 'rgb(40, 167, 69)',
								        borderColor: 'rgb(40, 167, 69)',
								        data: this.state.energyChart.datasets,
					        		}]
					        	}}
								width={100}
								height={270}
								options={{
									maintainAspectRatio: false
								}}
							/>
						</div>
					</div>
				</div>
				<div className="col-12 col-lg-6 mt-1">
					<div className="row">
						<div className="col-12 card-shadow py-3" style={{height:'300px'}}>
							<Bar
								data={{
									labels: this.state.amountChart.labels,
							        datasets: [{
								        label: "Amount Earned in KES",
								        backgroundColor: 'rgb(40, 167, 699)',
								        borderColor: 'rgb(40, 167, 699)',
								        data: this.state.amountChart.datasets,
					        		}]
					        	}}
								width={100}
								height={270}
								options={{
									maintainAspectRatio: false
								}}
							/>
						</div>
					</div>
				</div>
		    </div>
    	)
    }
}