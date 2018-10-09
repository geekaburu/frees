import React, { Component } from 'react'

import Alert from '../../layouts/Alert'
import Loader from '../../layouts/Loader';

export default class RegisterCustomer extends Component {
	constructor(props) {
        super(props)
        this.state = {
        	name: '',
			email: '', 
			phone_number: '',
			role_id: '',
			panels: '',
			voltage: '',
			power: '',
			alert:{
				display:false,
				type:'',
				title:'',
				body:''
			},
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
		this.handleModalDismiss = this.handleModalDismiss.bind(this)
    }

   	// Get data when the component loads
    componentDidMount(){
    	// Set loader to true
    	this.setState({
    		loader:false,
    	})
    }

		// Tear down the interval 
    componentWillUnmount() {
	}

	// Handle the dismiss of the alert modal
	handleModalDismiss(state){
    	if(state){
    		this.setState({
    			alert:{display:false,type:'',title:'',body:''}
    		})
    	}
    }

	// Handle change of input boxes
	handleChange(event) {	
	   this.setState({ [event.target.name]: event.target.value })	    		    	
	}

	handleSubmit(event) {
	    event.preventDefault();
	   	this.setState({ loader: true });
	   	axios.post('api/admin/register-customer', this.state)
    	.then((response) => {
    		console.log(response.data)
    		this.setState({
    			loader:false,
				alert:{
    				display:true,
    				type:'success',
    				title:'Success',
    				body:response.data.message
    			},
    		})
    	})
    	.catch((error) => {
    		this.setState({loader:false}, ()=>{
	    		if(User.hasTokenHasExpired(error.response.data)){
	    			this.props.history.push('/login')
	    		}
	    		// Launch the alert box
	    		this.setState({
	    			alert:{
	    				display:true,
	    				type:'error',
	    				title:'Error',
	    				body: App.displayErrors(error.response.data.errors)
	    			},
	    		})   			
    		})
    	})
    }

	render() {
    	return (
    		<div id="register" className="row m-0 align-items-center">
		    	<Loader load={this.state.loader} />
		    	{ this.state.alert.display ? 
					(
    					<Alert backdrop ='static' keyboard={false} focus={true} show={true} title={this.state.alert.title} body={this.state.alert.body} type={this.state.alert.type} dismissModal={this.handleModalDismiss} />
		    		) : null
    			}  
    			<div className="col-12 card-shadow pt-2 pb-3 mb-2">
					<div className="row m-0">						
						<div className="col-12 bg-dark-secondary text-white py-0">
							<div className="row">
								<div className="col-12 col-lg border border-white py-2 font-weight-bold">
									Date: {(new Date()).toLocaleDateString('en-GB')}
								</div>
								<div className="col-12 col-lg border border-white py-2 font-weight-bold">
								</div>
								<div className="col-12 col-lg border border-white py-2 font-weight-bold">
								</div>
								<div className="col-12 col-lg border border-white py-2 font-weight-bold">
								</div>
							</div> 
						</div>				
					</div>
				</div>	
    			<form name="register" className="col-12 px-0" onSubmit={this.handleSubmit} encType="multipart/form-data">	  
    				<div className="row">
		    			<div className="col-12 col-md-6">
		    				<div className="card">
		    					<h5 className="card-header bg-dark-primary text-white">Customer Information</h5>
								<div className="card-body px-0">
									<div className="row justify-content-center">
									 	<div className="form-group col-11">
							                <label className="font-weight-bold">Name</label>
							                <input className="form-control" placeholder="Your Name" name="name" type="text" required="" defaultValue={this.state.name} onChange={this.handleChange} />
							            </div>
							            <div className="form-group col-11">
							                <label className="font-weight-bold">Email</label>
							                <input className="form-control" placeholder="Your Email" name="email" type="email" required="" defaultValue={this.state.email} onChange={this.handleChange} />
							            </div>
							            <div className="form-group col-11">
							                <label className="font-weight-bold">Phone Number</label>
							                <input className="form-control" placeholder="Your Number" name="phone_number" type="text" required="" defaultValue={this.state.phone_number} onChange={this.handleChange} />
							            </div>
							        </div>
						        </div>
							</div>
			    		</div>
			    		<div className="col-12 col-md-6">
		    				<div className="card">
		    					<h5 className="card-header bg-dark-primary text-white">Panel Information</h5>
								<div className="card-body">
									<div className="form-group col-12">
						                <label className="font-weight-bold">Number of Panels</label>
						                <input className="form-control" placeholder="Number of Panels" name="panels" type="number" required="" defaultValue={this.state.panels} onChange={this.handleChange} />
						            </div>
						            <div className="form-group col-12">
						                <label className="font-weight-bold">Voltage</label>
						                <input className="form-control" placeholder="Panel Voltage" name="voltage" type="text" required="" defaultValue={this.state.voltage} onChange={this.handleChange} />
						            </div>
						            <div className="form-group col-12">
						                <label className="font-weight-bold">Power</label>
						                <input className="form-control" placeholder="Panel Power" name="power" type="text" required="" defaultValue={this.state.power} onChange={this.handleChange} />
						            </div>
						            <div className="form-group col-12">
						                <button type="submit" className="btn btn-success btn-block">Register Customer</button>
						            </div>
								</div>
							</div>
		    			</div>
			    	</div>
    			</form>
			</div>
    	)
    }
}