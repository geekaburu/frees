import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink, withRouter } from 'react-router-dom';

class Navbar extends Component {
	constructor(props) {
        super(props);
        this.state = {
            active: false,
            price: 0.00,
            user: {},
        }
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    // Get data when the component loads
    componentDidMount(){
    	this.fetchData()      	
    }

    fetchData(){
		axios.post('api/application/session-data')
    	.then((response) => {
    		this.setState({
    			user: response.data.user,   
    			price:response.data.price,
    		})
    	})
    	.catch((error) => {
    		if(User.hasTokenHasExpired(error.response.data)){
    			this.props.history.push('/login')
    		}
    	})
    }

    handleLogout(event){
    	event.preventDefault()
    	User.logout()
	    this.props.history.push('/login')
    }	

	toggleSidebar() {
		const currentState = this.state.active;
		this.setState({ active: !currentState }, () => {
			return this.props.sidebarChange(currentState)
        }); 
    };
    render() {
    	const elements = this.props.elements.map((element) =>
    		element.dropdown ? (
    			<li className="nav-item dropdown" key={element.title}>                               
			        <a className="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> 
			    		<span className="font-weight-bold">Hey <span className="text-success">{this.state.user.name}</span></span> 
			    		<img style={{height: '40px', width:'40px'}} src={App.asset(`storage/avatars/${this.state.user.avatar}`)} className="mx-2 rounded-circle img-fluid"/> 
			        </a>
			        <div className="dropdown-menu ">
			        	{element.dropdown.map((subElement) => 
							<NavLink exact to={subElement.link} key={subElement.title} className="dropdown-item bg-white text-dark">
				            	{subElement.title}
				            </NavLink>
			           )}
                    	<a className="dropdown-item bg-white text-dark" href="#" onClick={this.handleLogout}>Logout</a>
			        </div>
			    </li>
	        ) : (
	        	<li style={{marginTop:'-3px'}} className="nav-item" key={element.title}>
			        <NavLink exact className="nav-link text-success" to={element.link}>{element.title}</NavLink>
			    </li>
	        )
    	)

    	return (
    		<div>	
				<nav className="navbar navbar-expand-lg navbar-light bg-white mb-2 p-2 border-none rounded-0">
	                <div className="container-fluid">
	                    <button type="button" id="sidebarCollapse" className="btn btn-success btn-sm" onClick={this.toggleSidebar}>
		                    <FontAwesomeIcon icon="align-justify" size="lg" className="mr-2" />
	                        <span>Toggle Sidebar</span>
	                    </button>
	                    <button className="btn btn-dark d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
	                    	<FontAwesomeIcon icon="align-justify" size="lg" className="mr-2" />
	                    </button>
	                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
	                        <ul className="nav navbar-nav ml-auto align-items-center">
	                        	<li style={{marginTop:'-3px'}} className="font-weight-bold"><span className="text-success">Carbon Price Today</span>: KES {this.state.price} | </li>	 
	                        	{elements}	 
	                        </ul>
	                    </div>
	                </div>
	            </nav>
    		</div>
    	)
    }
}

export default withRouter(Navbar)