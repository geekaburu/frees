import moment from 'moment'
import React, { Component } from 'react'
import { Line,Bar } from 'react-chartjs-2'

import Loader from '../../layouts/Loader';

export default class FinancialStatement extends Component {
	constructor(props) {
        super(props)
        this.state = {
        	year : '',
        	statement : {},
        	chart : [],
        	financialYears : []
        }
        this.fetchData = this.fetchData.bind(this)
        this.handleYearChange = this.handleYearChange.bind(this)
    }

   	// Get data when the component loads
    componentDidMount(){
    	// Set loader to true
    	this.setState({
    		loader:true,
    		year : moment().year(),
    	}, () => {
	    	// Fetch data
	    	this.fetchData()

	    	// Apply fetch duration
	    	this.timerID = setInterval(
				() => this.fetchData(),
				App.fetchDuration(),
	    	)      	
    	})

    }

		// Tear down the interval 
    componentWillUnmount() {
	    clearInterval(this.timerID);
	}

	// Fetch data from the database
	fetchData(){
		axios.post('api/admin/finance-report', {
			year: this.state.year
		})
	    .then((response) => {
	    	this.setState({
	    		loader : false,
	    		year : response.data.statement.year,
	    		statement : response.data.statement,
	    		chart : response.data.chart,
	    		financialYears : response.data.financialYears,
	    	})
	    })
	    .catch((error) => {

	    })
	}

	handleYearChange(event){
		this.setState({
			loader:true,
			year:event.target.value,
		}, () => {
			this.fetchData()
		})
	}

	render() {
    	return (
    		<div id="finance" className="row m-0 align-items-center">
    			<Loader load={this.state.loader} />  
    			<div className="col-12 col-md-9 p-0">
    				<h4 className="font-weight-bold m-0">{`Income Statement ${ this.state.year == moment().year() ? `As at ${ moment().format('MMMM') }` : `For the Year Ended December`}`} {this.state.year}</h4>					
    			</div>
    			<div className="col-12 col-md-3 p-0">
					<div className="form-group m-0 mb-1">
					    <select className="form-control" name="year-select" value={this.state.year} onChange={this.handleYearChange}>
					    	{
					    		this.state.financialYears.map((year) => (
					      			<option key={ year.year } value={ year.year }>Financial Year {year.year}</option>
					    		)) 
					    	}
					    </select>
					</div>
    			</div>
    			<div className="col-12 col-md-6 p-0 pr-1">
	    			<div className="col-12" style={{border: '0.5px solid rgba(128, 128, 128, .4)', boxShadow: '0px 15px 30px -9px rgba(0, 0, 0, 0.8)', transition: 'all 0.3s cubic-bezier(0.25, 0.8, .25, 1)', minHeight:'510px'}}>
	    				<div className="row">
							<div className="col-12 p-0">
								<table className="table table-sm m-0">
									<tbody>
										<tr>
											<td className="w-75"></td>
											<td className="font-weight-bold w-25 text-right pr-4"><u>KSH</u></td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div className="row">
							<div className="col-12 bg-dark-primary text-white py-2">
								Incomes
							</div>
						</div>
						<div className="row">
							<div className="col-12 p-0">
								<table className="table">
									<tbody>
										<tr>
											<td className="font-weight-bold w-75">Incomes From Energy</td>
											<td className="w-25"></td>
										</tr>
										<tr>
											<td className="pl-4">Energy Collected</td>
											<td className="text-right pr-4">{ parseFloat(this.state.statement.energy ? this.state.statement.energy : 0.00).toLocaleString('en' , { minimumFractionDigits: 2, maximumFractionDigits: 2 }) } kWh</td>
										</tr>
										<tr>
											<td className="pl-4">Credits Equivalent</td>
											<td className="text-right pr-4">{ parseFloat(this.state.statement.credits ? this.state.statement.credits : 0.00).toLocaleString('en' , { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }</td>
										</tr>
										<tr>
											<td className="pl-4">Price</td>
											<td className="text-right pr-4">{ parseFloat(this.state.statement.price ? this.state.statement.price : 0.00).toLocaleString('en' , { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }</td>
										</tr>
										<tr>
											<td className="font-weight-bold">Total Incomes</td>
											<td className="font-weight-bold text-right pr-4">{ parseFloat(this.state.statement.income ? this.state.statement.income : 0.00).toLocaleString('en' , { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div className="row">
							<div className="col-12 bg-dark-primary text-white py-2">
								Remissions
							</div>
						</div>
						<div className="row">
							<div className="col-12 p-0">
								<table className="table">
									<tbody>
										<tr>
											<td className="font-weight-bold w-75">Remissions to Customers</td>
											<td className="w-25"></td>
										</tr>
										<tr>
											<td className="pl-4">Number of Customers</td>
											<td className="text-right pr-4">{ this.state.statement.customers ? this.state.statement.customers : 0 }</td>
										</tr>
										<tr>
											<td className="pl-4">Avg Remission/Customer</td>
											<td className="text-right pr-4">{ parseFloat(this.state.statement.avgRemission ? this.state.statement.avgRemission : 0.00).toLocaleString('en' , { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }</td>
										</tr>
										<tr>
											<td className="font-weight-bold">Total Remissions</td>
											<td className="font-weight-bold text-right pr-4">({ parseFloat(this.state.statement.totalRemission ? this.state.statement.totalRemission : 0.00).toLocaleString('en' , { minimumFractionDigits: 2, maximumFractionDigits: 2 }) })</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
						<div className="row">
							<div className="col-12 bg-success text-white p-0">
								<table className="table m-0">
									<tbody>
										<tr>
											<td className="w-75 font-weight-bold">Net Income</td>
											<td className="font-weight-bold w-25 text-right pr-4">{ parseFloat(this.state.statement.netIncome ? this.state.statement.netIncome : 0.00).toLocaleString('en' , { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
    			</div>
				<div className="col-12 col-md-6 p-0 mt-1 mt-lg-0">
					<div className="col-12" style={{border: '0.5px solid rgba(128, 128, 128, .4)', boxShadow: '0px 15px 30px -9px rgba(0, 0, 0, 0.8)', transition: 'all 0.3s cubic-bezier(0.25, 0.8, .25, 1)', minHeight:'510px'}} >
						{ this.state.chart.length > 0 &&  
						<Line
							data={{
								labels: this.state.chart.map(function(e) { return e.month}),
								datasets: [{
									type:'line',
							        label: 'Amount',
							        backgroundColor: 'rgba(40, 167, 69, 0.7)',
							        borderColor: 'rgba(40, 167, 69, 0.2)',
							        data: this.state.chart.map(function(e) { return e.energy}),
								}],
							}}
							width={ 100 }
							height={ 300 }
							options = {{
								maintainAspectRatio: false,
								legend: {
						            display: true,
						            position: 'bottom',
						        },
								title: {
						            display: true,
						            text: `Distribution of Revenue Flow in the Financial Year ${this.state.year}`
						        },
						        scales: {
						            yAxes: [{
						            	scaleLabel: {
								        	display: true,
								        	labelString: 'Money Inflow',
								        	fontColor:'rgba(4, 33, 47, 1)',
								      	}
								    }],
								    xAxes: [{
								    	type: 'time',
								    	distribution: 'linear',
					                    time: {
					                    	unit: 'month',
					                        parser: 'MMM',
					                        displayFormats: {
						                        month: 'MMM'
						                    }
					                    },
					                    ticks:  {
									        maxRotation: 0,
									        minRotation: 0,		
											autoSkip:false,
											source:'data'
										},
						            	scaleLabel: {
								        	display: true,
								        	labelString: 'Time in Months',
								        	fontColor:'rgba(4, 33, 47, 1)',
								      	}
								    }]
						        }
							}}
						/>}
					</div>
				</div>
			</div>
    	)
    }
}