import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

// Import Page Components
import Dashboard from './pages/Dashboard'
import SolarPanel from './pages/SolarPanel'
import PanelAnalysis from './pages/PanelAnalysis'
import EnergyReport from './pages/EnergyReport'
import CarbonTransactions from './pages/CarbonTransactions'
import Account from './pages/Account'

// Import Admin Components
import AdminDashboard from './pages/Admin/Dashboard'
import AdminCustomers from './pages/Admin/Customers'
import AdminCustomerAnalysis from './pages/Admin/CustomerAnalysis'
import AdminEnergyReport from './pages/Admin/EnergyReport'
import AdminCarbonTransactions from './pages/Admin/CarbonTransactions'

export class AppRoutes extends Component {
	constructor(props) {
        super(props);
        this.state = {
            customer: true
        }
    }
    componentDidMount(){    	
    	this.setState({
    		customer: User.role() == 'customer' ? true : false
    	})    		
    }
    render() {
    	return (
			<div>
				{!this.state.customer 
					? <Redirect to='/admin' />
					: (
						<div>
							<Route exact path='/' name='pages.home' component={Dashboard}></Route>
					        <Route path='/my-solar-panel' name='pages.solarpanel' component={SolarPanel}></Route>
					        <Route path='/panel-analysis/panels/:number' name='pages.carbon-report' component={PanelAnalysis}></Route>
					        <Route path='/energy-reports/panels/:id' name='pages.energy-reports' component={EnergyReport}></Route>
					        <Route path='/carbon-transactions' name='pages.carbon-transactions' component={CarbonTransactions}></Route>
					        <Route path='/account' name='pages.account' component={Account}></Route>
					    </div>
					)
				}
		    </div>
    	)
    }
}

export class AdminRoutes extends Component {
	constructor(props) {
        super(props);
        this.state = {
            admin: true
        }
    }
    componentDidMount(){    	
    	this.setState({
    		admin: User.role() == 'customer' ? false : true
    	})    		
    }
    render() {
    	return (
    		<div>
				{!this.state.admin 
					? <Redirect to='/' />
					: (
						<div>
					        <Route exact path='/admin' name='admin.home' component={AdminDashboard}></Route>
					        <Route path='/admin/customers' name='admin.solarpanel' component={AdminCustomers}></Route>
					        <Route path='/admin/customer-analysis/customers/:number' name='admin.customer-analysis' component={AdminCustomerAnalysis}></Route>
					        <Route path='/admin/energy-reports/customers/:id' name='admin.energy-reports' component={AdminEnergyReport}></Route>
					        <Route path='/admin/carbon-transactions' name='admin.carbon-transactions' component={AdminCarbonTransactions}></Route>
		    			</div>    				
					)}
			</div>
		)
    }
}

export class AuthRoutes extends Component {
    render() {
    	// 
    }
}