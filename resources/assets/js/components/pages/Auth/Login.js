import React, { Component } from 'react'
import Alert from '../../layouts/Alert'

export default class Login extends Component {
	constructor(props) {
        super(props);
        this.state = {
            email: '',
    		password: '',
    		loader:false,
    		alert:{ display:false, type:'', title:'' ,body:'' },
        }
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleModalDismiss = this.handleModalDismiss.bind(this)
    }	

    componentDidMount(){
    	if(User.isLoggedIn())
    		this.props.history.push(User.homepage())
    }

    handleModalDismiss(state){
    	if(state)
    		this.setState({
    			alert:false
    		})
    }

    handleChange(event) {
	    const name = event.target.name;
	    this.setState({
	        [name]: event.target.value
	    })
	}

	handleSubmit(event) {
	    event.preventDefault();
	   	this.setState({ loader: true }, () => {
			axios.post('/api/auth/login', {
		        email: this.state.email,
		        password: this.state.password
		    })
		    .then((response) => {
		        User.setToken(response.data)
		        const { from } = this.props.location.state || { from: { pathname: User.homepage() } }
		        this.props.history.push(from)
		    })
		    .catch((error) => {
		    	this.setState({
	    			loader:false,
	    			alert: { display:true, type:'error', title:'Error', body:error.response.data.message},
	    		})
		    }); 
        }); 
	}
    render() {
    	return (
    		<div id="auth" className="h-100 w-100 position-absolute">
    			{/* Include Alert boxes */}
				{ this.state.alert.display ? 
					(
						<Alert backdrop ='static' keyboard={false} focus={true} show={true} title={this.state.alert.title} body={this.state.alert.body} type={this.state.alert.type} dismissModal={this.handleModalDismiss} />
		    		) : null
    			}  		
    			<div className="overlay"></div>
				<div className="row justify-content-center row m-0 h-100 align-items-center">
					<div className="col-12 col-md-6 col-lg-4 text-white content">
						<div className="row">
							<div className="col-12 card-shadow bg-dark-primary p-5 rounded">
								<img className={`mx-auto ${this.state.loader ? 'd-block' : 'd-none'} `} src="img/loaders/wedges.svg" alt=""/>
								<form className={this.state.loader ? 'd-none' : 'd-block'} onSubmit={this.handleSubmit}>
						    		<h5 className="text-success my-3 font-weight-bold">Login</h5>
									<div className="text-left form-group">
								    	<label className="text-white"> <i className="fa fa-asterisk text-danger" aria-hidden="true"></i> Email address</label>
								    	<input type="email" className="form-control" name="email" placeholder="Your email" value={this.state.email} onChange={this.handleChange} required />
								  	</div>
								  	<div className="text-left form-group">
								    	<label className="text-white"> <i className="fa fa-asterisk text-danger" aria-hidden="true"></i> Password</label>
								    	<input type="password" className="form-control" placeholder="Your Password" name="password" value={this.state.password} onChange={this.handleChange} required />
								  	</div>
								  	<div className="form-check mb-2">
								    	<label className="form-check-label text-white">
								      		<input type="checkbox" className="form-check-input" name="remember_token" />
								      		Remember me
								    	</label>
								  	</div>
								  	<div className="text-left form-group">
								    	<button className="btn btn-success" type="submit">Login</button>
								  	</div>
								  	<a href="#" className="my-5 text-white">Forgot your password?</a>
								</form>
							</div>
						</div>					
					</div>
				</div>				
    		</div>
    	)  
    }
}