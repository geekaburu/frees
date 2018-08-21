import React, { Component } from 'react'
import Loader from '../layouts/Loader'
import Alert from '../layouts/Alert'

export default class Account extends Component {
	constructor(props){
		super(props)
		this.state = {
			alert:{
				display:false,
				type:'',
				title:'',
				body:''
			},
			name: '',
			email: '', 
			phone_number: '',
			town: '',
			avatar:'', 
			displayAvatar: App.asset(`storage/avatars/avatar.jpg`),
			curr_password: '',
			password: '',
			password_confirmation: '',					
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
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

	fetchData(){
		axios.post('/api/auth/me')
	    .then((response) => {
	    	this.setState({
				loader: false,
				name: response.data.name,
				email: response.data.email, 
				phone_number: response.data.phone_number,
				town: 'Buruburu',
				avatar:'', 
				displayAvatar:App.asset(`storage/avatars/${response.data.avatar}`),
				curr_password: '',
				password: '',
				password_confirmation: '',					
			})        
	    })
	    .catch((error) => {
	    	this.setState({loader:false})
    		if(User.hasTokenHasExpired(error.response.data)){
    			this.props.history.push('/login')
    		}
	    }); 
	}

	// Handle the dismiss of the alert modal
	handleModalDismiss(state){
    	if(state){
    		this.setState({
    			alert:{display:false,type:'',title:'',body:''}
    		})
    	}
    }

	handleChange(event) {	
	    const name = event.target.name;
	    name == 'avatar' ? this.handleImageUpload(event) : this.setState({ [name]: event.target.value })	    		    	
	}

	handleImageUpload(event){
		event.preventDefault()
		let reader = new FileReader()
		let file = event.target.files[0]
		reader.onload = (e) => {
			this.setState({
        		avatar: e.target.result,
        		displayAvatar: reader.result
      		})
    	}
    	reader.readAsDataURL(file)
	}

	handleSubmit(event) {
	    event.preventDefault();
	   	this.setState({ loader: true });
	   	axios.post('api/customers/update-profile', this.state)
    	.then((response) => {
    		this.setState({
    			loader:false,
    			name: response.data.user.name,
				email: response.data.user.email, 
				phone_number: response.data.user.phone_number,
				town: 'Buruburu',
				avatar:'', 
				curr_password: '',
				password: '',
				password_confirmation: '',
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
	    		var errors = <ul>{collection}</ul>
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
    		<div id="account" className="mt-2 row justify-content-center m-0">
    			<Loader load={this.state.loader} />
    			{ this.state.alert.display ? 
					(
    					<Alert backdrop ='static' keyboard={false} focus={true} show={true} title={this.state.alert.title} body={this.state.alert.body} type={this.state.alert.type} dismissModal={this.handleModalDismiss} />
		    		) : null
    			}  	
    			<div className="col-8 pt-3 card-shadow">
    				<div className="row">
						<form name="profile" className="col-12" onSubmit={this.handleSubmit} encType="multipart/form-data">	    
					        <div className="row">
					            <div className="col-12">
					            	<h6 className="text-white bg-dark-primary col-12 py-3 my-3">General Information</h6>
					            </div>
					            <div className="form-group col-12 col-lg-6">
					                <label className="font-weight-bold">Name</label>
					                <input className="form-control" placeholder="Your Name" name="name" type="text" required="" defaultValue={this.state.name} onChange={this.handleChange} />
					            </div>
					            <div className="form-group col-12 col-lg-6">
					                <label className="font-weight-bold">Email</label>
					                <input className="form-control" placeholder="Your Email" name="email" type="email" required="" defaultValue={this.state.email} onChange={this.handleChange} />
					            </div>
					            <div className="form-group col-12 col-lg-6">
					                <label className="font-weight-bold">Phone Number</label>
					                <input className="form-control" placeholder="Your Number" name="phone_number" type="text" required="" defaultValue={this.state.phone_number} onChange={this.handleChange} />
					            </div>
					            <div className="form-group col-12 col-lg-6">
					                <label className="font-weight-bold">Town/Estate</label>
					                <input className="form-control" placeholder="Your Town" name="town" type="text" required="" defaultValue={this.state.town} onChange={this.handleChange} />
					            </div>
					        </div>
					        <div className="row" id="image">
					        	<div className="col-12">
					            	<h6 className="text-white bg-dark-primary col-12 py-3 my-3">Profile Image Information</h6>
					            </div>
					        	<div className="form-group col-12">
									<div className="row">
										<div className="col-12">
											<label className="font-weight-bold">Upload Profile Image</label>
							            	<input type="file" className="form-control" name="avatar" placeholder="Upload Profile Image" accept="image/x-png,image/gif,image/jpeg, image/jpg" onChange={this.handleChange}/>
										</div>
									</div>					
								</div>
					        </div>
					        <div className="row">
					            <div className="col-12">
					            	<h6 className="text-white bg-dark-primary col-12 py-3 my-3">Password Information</h6>
					            </div>
					            <div className="form-group col-12 col-lg-6">
					                <label className="font-weight-bold">Current Password</label>
					                <input className="form-control" name="curr_password" type="password" placeholder="Current Password" onChange={this.handleChange}/>
					            </div>
					            <div className="form-group col-12 col-lg-6">
					                <label className="font-weight-bold">New Password</label>
					                <input className="form-control" name="password" type="password" placeholder="New Password" onChange={this.handleChange}/>
					            </div>
					            <div className="form-group col-12 col-lg-6">
					                <label className="font-weight-bold">Confirm your Password</label>
					                <input className="form-control" name="password_confirmation" type="password" placeholder="Confirm your password" onChange={this.handleChange}/>
					            </div>
						        <div className="form-group col-12">
						            <button className="btn btn-success">Update details</button>
						        </div>
					        </div>
					    </form>		  			
    				</div>
    			</div>
    			<div className="col-4 text-center mt-5">
    				<div className="row mt-2 justify-content-center">	
    					<div className="col-11 profile-card card-shadow py-3 rounded">
    						<div className="row justify-content-center">
								<div className="col-12">
									<img style={{height:'130px', width:'130px'}} className="img-fluid rounded-circle" src={this.state.displayAvatar} alt=""/>	
								</div>			
								<div className="col-8 mt-4">
									<h6 className="text-success font-weight-bold">CUSTOMER ACCOUNT</h6>
									<h6 className="text-white border-bottom border-light py-2">{this.state.name}</h6>		
									<h6 className="text-white font-weight-bold">{this.state.phone_number}</h6>		
									<h6 className="text-white font-weight-bold">Buruburu</h6>		
									<h6 className="text-white font-weight-bold">Nairobi Kenya</h6>		
								</div>
    						</div>
    					</div>				
					</div>
    			</div>
    		</div>
    	)
    }
}