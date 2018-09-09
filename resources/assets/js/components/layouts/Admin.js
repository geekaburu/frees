import React, { Component } from 'react';

// Import layouts
import { AdminRoutes }  from '../routes';
import Sidebar from './SideBar';
import Navbar from './Navbar';

export default class Admin extends Component {
	constructor(props) {
        super(props);
        this.state = {
            active: true
        }
        this.handleSidebarToggle = this.handleSidebarToggle.bind(this);
    }	

    // Handle the sidebar change 
	handleSidebarToggle(data){
		this.setState({ active: data }); 
	}

    render() {
    	return (
			<div className="d-flex align-items-stretch">
				<Sidebar title={`${window.appName} : Admin`} shortname={window.appInitials} elements={[
					{title:'Dashboard', icon:'tachometer-alt', link:'/admin'},
					{title:'Customers', icon:'users', link:'/admin/customers'},
					{title:'Customer Analysis', icon:'chart-line', link:'/admin/customer-analysis/customers/all'},
					{title:'Carbon Transactions', icon:'shopping-basket', link:'/admin/carbon-transactions'},
					{title:'Energy Reports', icon:['fab', 'react'], link:'/admin/energy-reports/customers/all'},
					{title:'Carbon Pricing', icon:'money-bill-alt', link:'/admin/carbon-pricing'},
				]} active={this.state.active} />
				<div id="content" className={`pl-4 pl-md-5 pl-lg-3 ${this.state.active ? 'active' : ''}`}>
					<div className="pl-4 pr-3 px-lg-3 pl-lg-5 pb-4 pt-3">	
						<Navbar username={User.data().name} avatar={`img/avatars/${User.data().avatar}`} elements={[
							{title:'My Solar Panels', link:'/my-solar-panel', dropdown:[]},						
						]} />
						<AdminRoutes />
					</div>
				</div>
			</div>
    	)  
    }
}