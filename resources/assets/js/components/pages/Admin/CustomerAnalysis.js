import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactSpeedometer from 'react-d3-speedometer'

import Chart from '../../layouts/Chart'
import Modal from '../../layouts/Modal'
import Loader from '../../layouts/Loader'
import { chartData } from '../../../resources/ChartHelper'

export default class CustomerAnalysis extends Component {
	constructor(props) {
        super(props)
        this.state = {
            chart: { datasets:[], labels:[], filter:'month'},
            customers: [],
            initialCustomers:[],
            activeCustomer:{
            	location:{
            		county:'',
            		town:'',
            	}
            },
            filter: this.props.match.params.number,
            stats: {
            	energy:0,
            	credits:0,
            	amount:0,
            },
        }
        this.handleFilterValue = this.handleFilterValue.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
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

	componentWillReceiveProps(nextProps) {
		this.setState({
			loader:true,
			filter:nextProps.match.params.number,
		},()=>{
			this.fetchData()	
		})
    }

	fetchData(){
		axios.post('api/admin/customer-analysis', {
      		chart_filter: this.state.chart.filter,	
      		customer: this.state.filter,	
    	})
    	.then((response) => {
    		var chart = chartData(response.data.chart.data, ['energy'])
    		chart.filter = this.state.chart.filter
    		this.setState({
				loader:false,
				chart: chart,
    			customers: this.state.customers.length == 0 ?  response.data.customers : this.state.customers,
    			initialCustomers: this.state.initialCustomers.length == 0 ?  response.data.customers : this.state.initialCustomers,
    			stats: response.data.stats,
    			activeCustomer: response.data.activeCustomer,
			})

    	})
    	.catch((error) => {
    		if(User.hasTokenHasExpired(error.response.data)){
    			this.props.history.push('/login')
    		}
    	})
	}

	handleSearch(event){
		var customers = this.state.initialCustomers
		customers = customers.filter( customer => {
			return customer.name.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
		})
		this.setState({customers})	    
	}

	handleFilterValue(value){
		this.setState({
			loader:true,
			chart:{
				datasets:'', 
				labels:'', 
				filter: value 
			}
		}, ()=>{
			this.fetchData()
		})
	}
    render() {
    	const customerModalBody = (
    		<div className="row justify-content-center">
    			<div className="col-12 text-center mb-3">
    				<img style={{height:'130px', width:'130px'}} className="img-fluid rounded-circle" src="../img/avatar.jpg" alt=""/>	
    			</div>
    			
    		</div>
    	)

    	const customers = this.state.customers.map((customer)=>(
    		<div key={customer.id} className="row">
				<NavLink className="col-12 py-2 px-0 border-white border-bottom text-white" to={`/admin/customer-analysis/customers/${customer.id}`}>
					<FontAwesomeIcon icon="user" size="lg" className="mr-2" />
					{customer.name}
				</NavLink>
			</div>
    	))

    	return (
			<div id="carbon-reports" className="row m-0">
				<Loader load={this.state.loader} /> 
				<div className="col-12 col-lg-2 bg-dark-primary panel-nav-bar px-0 mb-1" style={{ boxShadow: '1px 2px 2px rgba(0, 0, 0, 0.7)' }}>
					<input placeholder="Search" type="text" className="w-100 form-control rounded-0" onChange={this.handleSearch}/>	
					<div className="side-selector bg-dark-primary">
						<div className="row">
							<NavLink className="col-12 py-2 px-0 border-white border-bottom text-white" to={`/admin/customer-analysis/customers/all`}>
								<FontAwesomeIcon icon="qrcode" size="lg" className="mr-2" />
								All Customers
							</NavLink>
						</div>					
						{customers}					
					</div>
				</div>
				<div className="col-12 col-lg-10 p-0 pl-lg-2">
					<div className="row mx-0">
						<div className="col-12 card-shadow">
							<div className="row">
								<div className="col-12 col-md-3 py-2 text-white bg-dark-secondary border border-white">
									{ this.state.filter == 'all' ? (<span>Customers: {this.state.customers.length} </span>) : (<span>ID: {this.state.activeCustomer.id}</span>)}
								</div>
								<div className="col-12 col-md-3 py-2 text-white bg-dark-secondary border border-white">
									{ this.state.filter == 'all' ? (<span>N/A</span>) : (<span>Number : {this.state.activeCustomer.phone_number} </span>)}
								</div>
								<div className="col-12 col-md-3 py-2 text-white bg-dark-secondary border border-white">
									{ this.state.filter == 'all' ? (<span>N/A</span>) : (<span>Email : {this.state.activeCustomer.email}</span>)}
								</div>
								<div className="col-12 col-md-3 py-2 text-white bg-dark-secondary border border-white">
									{ this.state.filter == 'all' ? (<span>N/A</span>) : (<span>Active From : {(new Date(this.state.activeCustomer.created_at)).toLocaleDateString('en-GB')}</span>)}
								</div>
							</div>
						</div>
					</div>
					<div className="row mx-0 mt-1">
						<div className="col-12 px-0 pr-1 h-100">
							<div style={{height:'440px'}} className="col-12 card-shadow py-2">
								<Chart
									data={ this.state.chart }
									width={ 100 }
									height={ 287 }
									filters={[{label: 'Live', value:'live'},{label: 'Today', value:'today'}, {label: 'This Week', value:'week'}, {label: 'This Month', value:'month'}, {label: 'Past 3 Months', value:'3month'}, {label: 'This Year', value:'year'}]}
									activeFilter='month'
									handleFilterValue={this.handleFilterValue}
									title='A Graph of Energy Against Time'
									axesLabels = {{
										yAxes:'Energy in kWh',
										'xAxes': 'Time'
									}}
								/>
							</div>
						</div>		
					</div>
				</div>
				<div className="row mx-0 mt-1">
					<div className="col-12 mt-1 bg-dark-secondary text-white card-shadow">
						<div className="row">
							<div className="col-12 col-md-4 col-lg text-center border py-3">
								<div className="w-100" style={{
								    height: '120px'
								}}>
									<ReactSpeedometer
										fluidWidth={true}
										maxValue={10000}
									  	value={parseInt(this.state.stats.energy)}
									  	width={200}
									  	height={250}
									  	needleColor="purple"
									  	segments={5}
									  	textColor="#fff"
									  	needleTransitionDuration={4000}
									  	needleTransition="easeElastic"
									  	currentValueText={String(this.state.stats.energy.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits:2 }))}
									  	ringWidth={45}
									/>
								</div>
								<div className="col-12 pt-2">Energy</div>
							</div>
							<div className="col-12 col-md-4 col-lg text-center border py-3">
								<div className="w-100" style={{
								    height: '120px'
								}}>
									<ReactSpeedometer
										fluidWidth={true}
										maxValue={20}
									  	value={parseInt(this.state.stats.credits)}
									  	width={200}
									  	height={250}
									  	needleColor="green"
									  	segments={5}
									  	textColor="#fff"
									  	needleTransitionDuration={4000}
									  	needleTransition="easeElastic"
									  	currentValueText={String(this.state.stats.credits.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits:2 }))}
									  	ringWidth={45}
									/>
								</div>
								<div className="col-12 pt-2">Credits</div>
							</div>
							<div className="col-12 col-md-4 col-lg text-center border py-3">
								<div className="w-100" style={{
								    height: '120px'
								}}>
									<ReactSpeedometer
										fluidWidth={true}
										maxValue={30000}
									  	value={parseInt(this.state.stats.amount)}
									  	width={200}
									  	height={250}
									  	needleColor="blue"
									  	segments={5}
									  	textColor="#fff"
									  	needleTransitionDuration={4000}
									  	needleTransition="easeElastic"
									  	currentValueText={String(this.state.stats.amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits:2 }))}
									  	ringWidth={45}
									/>
								</div>
								<div className="col-12 pt-2">Value</div>
							</div>
							<div className="col-12 col-lg-4 text-center pt-4 px-4 pb-2">
								{this.state.activeCustomer !='all' && 
								<div>
									<table className="table table-sm table-bordered table-hover w-100">
									    <tbody>
									    	<tr>
									            <th scope="row" className="bg-dark-primary text-white pl-2 font-weight-normal">Name</th>
									            <td className="text-left pl-2">{this.state.activeCustomer.name}</td>
									        </tr>
									        <tr>
									            <th scope="row" className="bg-dark-primary text-white pl-2 font-weight-normal">Email</th>
									            <td className="text-left pl-2">{this.state.activeCustomer.email}</td>
									        </tr>
									        <tr>
									            <th scope="row" className="bg-dark-primary text-white pl-2 font-weight-normal">Phone Number</th>
									            <td className="text-left pl-2">{this.state.activeCustomer.phone_number}</td>
									        </tr>
									        <tr>
									            <th scope="row" className="bg-dark-primary text-white pl-2 font-weight-normal">County</th>
									            <td className="text-left pl-2">{this.state.activeCustomer.location.county}</td>
									        </tr>
									        <tr>
									            <th scope="row" className="bg-dark-primary text-white pl-2 font-weight-normal">Town</th>
									            <td className="text-left pl-2">{this.state.activeCustomer.location.town}</td>
									        </tr>
									    </tbody>
									</table>
								</div>
								}
								{this.state.activeCustomer =='all' && 
									<div className="text-center">
										<h4>Click on Customer Name to View More</h4>
									</div>	
								}
							</div>
						</div>
					</div>
		    	</div>
		    </div>
    	)
    }
}