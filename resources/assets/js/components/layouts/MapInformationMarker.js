import React, { Component } from 'react';
import { Marker, InfoWindow} from 'react-google-maps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

export default class MapInformationMarker extends Component {
	constructor(props) {
        super(props)
        this.state = {
            windowOpen: false
        }
        this.handleWindowToggle = this.handleWindowToggle.bind(this)
    }   

    handleWindowToggle(value){
        this.setState({
            windowOpen:value
        })
    }
  
    render() {
    	return (
	    	<Marker onClick={() => this.handleWindowToggle(true)} position={this.props.position}>
	            {this.state.windowOpen && 
	            <InfoWindow onCloseClick={() => this.handleWindowToggle(false)}>
	                <div className="pl-3">
	                    <table style={{width:'400px'}} className="mt-4 table table-sm table-bordered">
	                    	<tbody>
	                    		<tr>
	                    			<th>Customer Name</th>
	                    			<td>{this.props.data.customer}</td>	                    			
	                    		</tr>
	                    		<tr>
	                    			<th>Number of Panels</th>
	                    			<td>{this.props.data.panels}</td>	                    			
	                    		</tr>
	                    		<tr>
	                    			<th>County</th>
	                    			<td>{this.props.data.county}</td>	                    			
	                    		</tr>
	                    		<tr>
	                    			<th>Town</th>
	                    			<td>{this.props.data.town}</td>	                    			
	                    		</tr>
	                    		<tr>
	                    			<th>Energy so Far</th>
	                    			<td>{this.props.data.energy} Kwh</td>	                    			
	                    		</tr>
	                    	</tbody>	                    	
	                    </table>    
	                    <Link to={`/admin/customer-analysis/customers/${this.props.data.id}`} className="btn btn-success btn-sm">View More</Link>           
	                </div>
	            </InfoWindow>}
	        </Marker>
	    )
    }    	
}