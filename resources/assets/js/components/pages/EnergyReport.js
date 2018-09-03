import React, { Component } from 'react'
import Select from 'react-select';
import moment from 'moment';

import DataTable from '../layouts/DataTable'
import Loader from '../layouts/Loader';
import Picker from '../layouts/Picker';
import Alert from '../layouts/Alert'

require('../../resources/Datetime')

export default class EnergyReport extends Component {
	constructor(props) {
        super(props)
        this.state = {
            alert:{ display:false, type:'', title:'' ,body:'' },
            transactions:'',
            upperBar: '',
            panels: '',
            options: [{label:'', value:''}],
            filters: {
            	'panel_id':this.props.match.params.id == 'all' ? '' : this.props.match.params.id,
            	'start_date':'',
            	'end_date':'',
            }
        }
        this.fetchData = this.fetchData.bind(this)
        this.handleDateChange = this.handleDateChange.bind(this)
        this.handleSelectChange = this.handleSelectChange.bind(this)
        this.handleModalDismiss = this.handleModalDismiss.bind(this)
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

	// On receipt of new props
	componentWillReceiveProps(nextProps) {
		this.setState({
			filters: {
            	'panel_id':nextProps.match.params.id,
            	'start_date': this.state.filters.start_date,
            	'end_date': this.state.filters.end_date,
            },
			loader:true,
		},()=>{
			this.fetchData()					
			this.setState({
				loader:false,
			})
		})
    }

    // Fetch data from the database
    fetchData(){
		axios.post('api/customers/energy-reports', this.state.filters)
    	.then((response) => {
    		let options = response.data.panels.map(function(e) { return {label:`Panel #${e.id}`, value:e.id}})
    		options.unshift({label:'All Panels', value:'all'})
    		this.setState({
    			loader:false,
    			options: options,
    			transactions: {
    				data:response.data.transactions,
    				columns: [
						{ title: 'Date', data: 'date' },
						{ title: 'Panel', data: 'panel_id' },
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
	handleSelectChange(selected){
		this.setState({ 
			filters:{
				'start_date': this.state.filters.start_date,			
				'end_date': this.state.filters.end_date, 			
				'panel_id': selected.value, 		
			} 
		}, () => { 
			this.props.history.push(`/energy-reports/panels/${selected.value}`)
		})		
	}
	
	// Handle date change
	handleDateChange(id, data){
		this.setState({
			filters: {
				'start_date': (id == 'start_date' ? data : this.state.filters.start_date),			
				'end_date': (id == 'end_date' ? data : this.state.filters.end_date), 			
				'panel_id': this.state.filters.panel_id, 			
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
							<small className="font-weight-bold px-2">Choose Panel</small>
							<Select
						        value={this.state.filters.options}
						        onChange={this.handleSelectChange}
						        options={this.state.options}
						        className="form-control p-0 rounded-0"
						        isSearchable
						        placeholder="Select a Panel"
						        defaultValue={{label:this.props.match.params.id == 'all' ? 'All Panels' : `Panel #${this.props.match.params.id}`, value:this.props.match.params.id}}
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
							sumColumns={[2,4,5]}
							order={[[ 0, 'desc' ]]}
							withFooter={true}
							defs={[{
				                'render': function ( data, type, row ) {
					                    return parseFloat(data).toFixed(2);
					                },
					                'targets': [2]
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