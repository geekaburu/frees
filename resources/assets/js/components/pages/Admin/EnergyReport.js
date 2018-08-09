import React, { Component } from 'react'
import Select from 'react-select';
import moment from 'moment';

import DataTable from '../../layouts/DataTable'
import Loader from '../../layouts/Loader';
import Picker from '../../layouts/Picker';
import Alert from '../../layouts/Alert'

require('../../../resources/Datetime')

export default class EnergyReport extends Component {
	constructor(props) {
        super(props)
		this.parameters = new URLSearchParams(this.props.location.search)
        this.state = {
            loader:true,
            alert:{ display:false, type:'', title:'' ,body:'' },
            transactions:'',
            upperBar: '',
            panels: '',
            countyOptions: [{label:'', value:''}],
            customerOptions: [{label:'', value:''}],
            filters: {
            	customer:{
            		value: this.props.match.params.id == 'all' ? '' : this.props.match.params.id,
            		label: 'All Customers',
            	},
            	county:{
            		value: this.parameters.has('county') ? this.parameters.get('county') : 'all',
            		label: 'All Counties',
            	},
            	'start_date':'',
            	'end_date':'',
            }
        }
        this.fetchData = this.fetchData.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.handleCustomerChange = this.handleCustomerChange.bind(this)
        this.handleCountyChange = this.handleCountyChange.bind(this)
        this.handleModalDismiss = this.handleModalDismiss.bind(this)
    }

	// Get data when the component loads
    componentDidMount(){
    	this.fetchData()   	
    }

	// Tear down the interval 
    componentWillUnmount() {
	    //clearInterval(this.timerID);
	}	

	componentWillReceiveProps(nextProps) {
		this.setState({
			filters: {
				customer: {
            		label: this.state.filters.customer.label,
            		value: nextProps.match.params.id
            	},
            	start_date: this.state.filters.start_date,
            	end_date : this.state.filters.end_date,
        		county : this.state.filters.county,
            },
			loader:true,
		},()=>{
			this.fetchData()					
			this.setState({
				loader:false,
			})
		})
    }

    fetchData(){
    	this.setState({
    		loader:true
    	}, ()=>{
    		axios.post('api/admin/energy-reports', {
				'customer_id':this.state.filters.customer.value,
	        	'start_date': this.state.filters.start_date,
	        	'end_date': this.state.filters.end_date,
	        	'county_id': this.state.filters.county.value,
			})
	    	.then((response) => {
	    		let countyOptions = response.data.counties.map(function(e) { return {label:`${e.name}`, value:e.id}})
	    		countyOptions.unshift({label:'All Counties', value:'all'})

	    		let customerOptions = response.data.customers.map(function(e) { return {label:`${e.name}`, value:e.id}})
	    		customerOptions.unshift({label:'All Customers', value:'all'})

	    		let defaultCounty = countyOptions.find(object => object.value == this.parameters.get('county'))
	    		let defaultCustomer = customerOptions.find(object => object.value == this.props.match.params.id)
	    
	    		this.setState({
	    			loader:false,
	    			countyOptions,
	    			customerOptions,
	    			filters:{
		    			customer:this.props.match.params.id && defaultCustomer
		            		? defaultCustomer
							: { label: 'All Customers', value:'all'},
		            	county:this.parameters.has('county') && defaultCounty 
		            		? defaultCounty
							: { label: 'All Counties', value:'all'},
		    		},
	    			transactions: {
	    				data:response.data.transactions,
	    				columns: [
							{ title: 'Date', data: 'date' },
							{ title: 'County', data: 'county' },
							{ title: 'Customer', data: 'customer' },
		            		{ title: 'Energy (Kwh)', data: 'energy' },
		            		{ title: 'Price', data: 'price' },
		            		{ title: 'Credits', data: 'credits' },
		            		{ title: 'Amount (Ksh)', data: 'amount' },
		            		{ title: 'Status', data: 'status' },
		    			]
	    			},
				})
	    	})
	    	.catch((error) => {
	    		if(User.hasTokenHasExpired(error.response.data)){
	    			this.props.history.push('/login')
	    		}
	    	})
    	})		
	}

    // Handle the dismiss of the alert modal
	handleModalDismiss(state){
    	if(state){
    		this.setState({
    			alert:{display:false,type:'',title:'',body:''}
    		})
    	}
    }

	// Handle select change
	handleCustomerChange(selected){
		this.setState({ 
			filters:{
				'start_date': this.state.filters.start_date,			
				'end_date': this.state.filters.end_date, 			
				'customer': {
					label: selected.label,
					value: selected.value,
				}, 		
				'county': this.state.filters.county, 		
			} 
		}, () => { 
			this.props.history.push(`/admin/energy-reports/customers/${selected.value}`)
		})		
	}

	// Handle select change
	handleCountyChange(selected){
		this.setState({ 
			filters:{
				'start_date': this.state.filters.start_date,			
				'end_date': this.state.filters.end_date, 			
				'customer': { 
					label:'All Customers', 
					value:'all' 
				}, 		
				'county': {
					'value': selected.value,
					'label': selected.label
				}, 		
			} 
		}, () => { 
			this.props.history.push(`/admin/energy-reports/customers/${this.state.filters.customer.value}`)
		})		
	}

	// Handle date change
	handleDateChange(id, data){
		this.setState({
			filters: {
				'start_date': (id == 'start_date' ? data : this.state.filters.start_date),			
				'end_date': (id == 'end_date' ? data : this.state.filters.end_date), 			
				'customer': this.state.filters.customer, 			
				'county': this.state.filters.county, 			
			}
		}, ()=>{
			if(this.state.filters.start_date && this.state.filters.end_date){
				const startDate = moment(this.state.filters.start_date,'DD/MM/YYYY')
				const endDate =  moment(this.state.filters.end_date,'DD/MM/YYYY')
				if(moment.duration(startDate.diff(endDate)).asDays() > 0){
					this.setState({
		    			loader:false,
		    			alert:{display:true,type:'error',title:'Error',body:'The start date can not be before the end date.'},
		    		})
	    		} else this.fetchData()
			} else this.fetchData()				
		})
	}
    render() {
    	return (
			<div id="energy-reports" className="row align-items-center justify-content-center m-0">
				<Loader load={this.state.loader} />  
				{ this.state.alert.display ? 
					(
    					<Alert backdrop ='static' keyboard={false} focus={true} show={true} title={this.state.alert.title} body={this.state.alert.body} type={this.state.alert.type} dismissModal={this.handleModalDismiss} />
		    		) : null
    			}  	
				<form className="col-12 pt-2 pb-3 my-1 card-shadow search-bar">
					<div className="row h-100 align-items-end m-0">
						<div className="form-group col p-0 px-1 m-0">
							<small className="font-weight-bold px-2">Choose County</small>
							<Select
						        value={this.state.filters.county}
						        onChange={this.handleCountyChange}
						        options={this.state.countyOptions}
						        className="form-control p-0 rounded-0"
						        isSearchable
						        placeholder="Select a County"
						    />
						</div>
						<div className="form-group col p-0 px-1 m-0">
							<small className="font-weight-bold px-2">Choose Customer</small>
							<Select
						        value={this.state.filters.customer}
						        onChange={this.handleCustomerChange}
						        options={this.state.customerOptions}
						        className="form-control p-0 rounded-0"
						        isSearchable
						        placeholder="Select a Customer"
						    />
						</div>
						<div className="form-group col p-0 px-1 m-0">
							<small className="font-weight-bold px-2">From Date</small>
							<Picker
								id="start_date"
								todayButton={'Pick Today'}
								placeholderText="Select a Date"
								locale="en-gb"
								withPortal
								showYearDropdown
								isClearable={true}
								maxDate={moment()}
								fixedHeight
								className="form-control w-100 rounded-0 text-dark"
					            scrollableYearDropdown
					            yearDropdownItemNumber={15}
					            handleDateModification={this.handleDateChange}
							/>
						</div>
						<div className="form-group col p-0 px-1 m-0">
							<small className="font-weight-bold px-2">End Date</small>
							<Picker
								id="end_date"
								todayButton={'Pick Today'}
								placeholderText="Select a Date"
								locale="en-gb"
								withPortal
								showYearDropdown
								isClearable={true}
								maxDate={moment()}
								fixedHeight
								className="form-control w-100 rounded-0 text-dark"
					            scrollableYearDropdown
					            yearDropdownItemNumber={15}
					            handleDateModification={this.handleDateChange}
							/>
						</div>
					</div>			
				</form>
				<div className="col-12 py-3 card-shadow mt-1">
					{ this.state.transactions.columns 
						? <DataTable 
							data={this.state.transactions.data}
							columns={this.state.transactions.columns}
							sumColumns={[3,5,6]}
							searchSelect={[7]}
							order={[[ 0, 'desc' ]]}
							withFooter={true}
							defs={[{
				                'render': function ( data, type, row ) {
					                    return parseFloat(data).toFixed(2);
					                },
					                'targets': [3,4,6]
					            },
					            {
					                'render': $.fn.dataTable.render.moment('YYYY-MM-DD HH:mm:ss', 'DD/MM/YYYY'),
						            'targets': [0]
					            }
					        ]}
						/>
						: '' 
					}
				</div>
		    </div>
    	)
    }
}