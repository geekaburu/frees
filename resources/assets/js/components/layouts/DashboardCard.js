import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom';

export default class DashboardCard extends Component {
    render() {
    	return (
			<div id="dashboard-card" className="card mt-4 rounded-0">
				<div className="overlay"></div>
				<div className="card-body">
					<div className="row">
						<div className="col-6">
							<div style={{backgroundColor:this.props.iconStyle}} className="icon float-left text-white p-3 rounded">
								<FontAwesomeIcon icon={this.props.icon} size="2x" pulse />					
							</div>
						</div>
						<div className="col-12 mt-3 text-white">
							<h5 className="card-title font-weight-bold">{this.props.title}</h5>
							<h6 style={{marginTop:'-10px'}} className="card-text font-weight-bold text-success">{this.props.text}</h6>		
						</div>
					</div>
				</div>
			</div>
    	)
    }
}