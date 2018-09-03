import React, { Component } from 'react'

import Alert from '../../layouts/Alert'
import Loader from '../../layouts/Loader';

export default class SimulateMarket extends Component {
	constructor(props) {
        super(props)
        this.state = {
        	alert:{ display:false, type:'', title:'', body:'' },
        	price: '',
        	rate: '',
        }
		this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.fetchData = this.fetchData.bind(this)
        this.handleModalDismiss = this.handleModalDismiss.bind(this)
    }

	// Get data when the component loads
    componentDidMount(){
    	// Set loader to true
    	this.setState({loader:true})
    	// Fetch data
    	this.fetchData();   
    }

	// Tear down the interval 
    componentWillUnmount() {
	}

	// Fetch data from the database
	fetchData(){
		axios.post('api/panel/market-pricing')
	    .then((response) => {
	    	this.setState({
	    		loader:false,
	    		price:response.data.price,
	    		rate:response.data.rate,
	    	})
	    })
	    .catch((error) => {

	    })
	}

	// Handle data update
	handleChange(event) {	
	   this.setState({[event.target.name]: event.target.value })	    		    	
	}

	// Handle when data is submitted
	handleSubmit(event) {
		// Validate input values
		if(!this.state.price || !this.state.rate){
			this.setState({
	    		alert: { display:true, type:'error', title:'Error', body:'You cannot have empty values'},
	    	})
	    	return
		}
		// Submit values to database
		this.setState({
	    	loader:true
	    },()=>{
	    	axios.post('api/panel/create-pricing', this.state)
		    .then((response) => {
		    	this.setState({
		    		loader:false,
		    		alert: { display:true, type:'success', title:'Success', body:response.data.message},
		    	})
		    })
		    .catch((error) => {
		    	this.setState({
		    		loader:false,
		    		alert: { display:true, type:'error', title:'Error', body:error.response.data.message},
		    	})
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

	render() {
    	return (
			<div id="market-simulation" className="h-100 w-100 position-absolute">
				{ 	
					this.state.alert.display &&
					<Alert backdrop ='static' keyboard={false} focus={true} show={true} title={this.state.alert.title} body={this.state.alert.body} type={this.state.alert.type} dismissModal={this.handleModalDismiss} />
				}
    			<div className="overlay"></div>
    			<div className="row justify-content-center row m-0 h-100 align-items-center">
					<div className="col-11 col-md-10 col-lg-6 text-white content">
						<Loader load={this.state.loader} /> 
						<div className="row">
							<div className="col-12 card-shadow bg-dark-primary pt-1 px-4 pb-4 rounded">
								<div className="row">	
									<div className="col-12 mb-3 text-center">	
										<img className="mx-auto d-block w-auto" src={App.asset('img/loaders/globe.svg')} alt="" /> 	
										<h4 className="font-weight-bold">Carbon Market Simulation Board</h4>
										<p>Insert values and click update</p>
									</div>	
									<div className="col-12 col-md-6 mt-1">	
										<label className="text-center w-100 text-success font-weight-bold">Carbon Price Today</label>
										<div className="input-group mb-3">
											<div className="input-group-prepend">
											    <span className="input-group-text bg-dark text-white">KES</span>
											</div>
										  	<input name="price" type="number" min="1" className="form-control text-center" onChange={this.handleChange} defaultValue={this.state.price} />
										  	<div className="input-group-append">
										    	<button className="btn btn-outline-secondary text-white" type="button" onClick={(e) => this.handleSubmit(e, 'price')}>Update</button>
										  	</div>
										</div>
									</div>
									<div className="col-12 col-md-6 mt-1">	
										<label className="text-center w-100 text-success font-weight-bold">Carbon Rate Today</label>
										<div className="input-group mb-3">
											<div className="input-group-prepend">
											    <span className="input-group-text bg-dark text-white">KES</span>
											</div>
										  	<input name="rate" type="number" min="1" className="form-control text-center" onChange={this.handleChange} defaultValue={this.state.rate} />
										  	<div className="input-group-append">
										    	<button className="btn btn-outline-secondary text-white" type="button" onClick={(e) => this.handleSubmit(e, 'rate')}>Update</button>
										  	</div>
										</div>
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