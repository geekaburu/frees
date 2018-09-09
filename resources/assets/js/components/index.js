import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import App from './layouts/App'
import Admin from './layouts/Admin'
import Login from './pages/Auth/Login'
import Protected from './layouts/Protected'
import SimulateMarket from './pages/Global/SimulateMarket'

// Font awesome libraries 
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faTachometerAlt, faAlignJustify, faSun, faGlobe, faNewspaper, faShoppingBasket, faQrcode, faCreditCard, faBurn, faMoneyBillAlt, faUserClock, faHandHoldingUsd, faUsers, faChartLine, faSuitcase, faEye, faUser, faTrophy, faBuilding, faCalendarPlus, faArrowAltCircleRight, faArrowAltCircleLeft, faTimesCircle} from '@fortawesome/free-solid-svg-icons'
library.add(fab, faTachometerAlt, faAlignJustify, faSun, faGlobe, faNewspaper, faShoppingBasket, faQrcode, faCreditCard, faBurn, faMoneyBillAlt, faUserClock, faHandHoldingUsd, faUsers, faChartLine, faSuitcase, faEye, faUser, faTrophy, faBuilding, faCalendarPlus, faArrowAltCircleRight, faArrowAltCircleLeft, faTimesCircle)

// Handle the main app
if (document.getElementById('app')) {
    ReactDOM.render(
    	<BrowserRouter>
    		<Switch>
    			<Route exact path='/market/simulate' component={ SimulateMarket }  />
                <Route exact path='/login' render={props => <Login {...props} /> }  />
                <Protected path='/admin' component={ Admin } />
                <Protected path='/' component={ App } />
    		</Switch>
    	</BrowserRouter>, 
    document.getElementById('app'))
}