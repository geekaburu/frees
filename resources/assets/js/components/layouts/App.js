import React, { Component } from 'react';

// Import layouts
import { AppRoutes }  from '../routes';
import Sidebar from './SideBar';
import Navbar from './Navbar';

export default class App extends Component {
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
				<Sidebar title={window.appName} shortname={window.appInitials} elements={[
					{title:'Dashboard', icon:'tachometer-alt', link:'/'},
					{title:'My Solar Panels', icon:'sun', link:'/my-solar-panel'},
					{title:'Panel Analysis', icon:'qrcode', link:'/panel-analysis/panels/all'},
					{title:'Carbon Transactions', icon:'shopping-basket', link:'/carbon-transactions'},
					{title:'Energy Reports', icon:['fab', 'react'], link:'/energy-reports/panels/all'},
					{title:'Carbon Pricing', icon:'money-bill-alt', link:'/carbon-pricing'},
				]} active={this.state.active} />
				<div id="content" className={`pl-4 pl-md-5 pl-lg-3 ${this.state.active ? 'active' : ''}`}>
					<div className="pl-4 pr-3 px-lg-3 pl-lg-5 pb-4 pt-3">
						<Navbar elements={[
							{title:'My Solar Panels', link:'#', dropdown:[
								{title:'Account', link:'/account'},
							]},						
						]} />
						<AppRoutes />						
					</div>
				</div>
			</div>
    	)  
    }
}