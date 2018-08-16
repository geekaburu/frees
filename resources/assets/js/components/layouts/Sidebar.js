import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from 'react-router-dom';
import ReactTooltip from 'react-tooltip'

export default class Sidebar extends Component {
    render() {
    	const elements = this.props.elements.map((element) =>
    		element.collapse ? (
    			<li data-for="sidebar" data-tip={element.title} key={element.title}>
		        	<a href={`#${element.link}SubMenu`} data-toggle="collapse" aria-expanded="false" className="dropdown-toggle position-relative">
	                    <FontAwesomeIcon icon={element.icon} size="lg" className="mr-2 text-success" />
	                    <span>{element.title}</span>                        
	                </a>
	                <ul className="collapse list-unstyled" id={`${element.link}SubMenu`}>
	                	{element.collapse.map((subElement) => 
		                    <li data-for="sidebar" data-tip={subElement.title}>
		                    	<NavLink exact to={subElement.link}>
		                        	<FontAwesomeIcon icon={subElement.icon} size="lg" className="mr-2 text-success" />
		                    		<span>{subElement.title}</span>       
		                        </NavLink>
		                    </li>
		                )}
	                </ul>
	            </li>
	        ) : (
	        	<li data-for="sidebar" data-tip={element.title} key={element.title}>
	    			<NavLink exact to={element.link}>
	                    <FontAwesomeIcon icon={element.icon} size="lg" className="mr-2 text-success" />
	                    <span>{element.title}</span>
	                </NavLink>
	            </li>
	        )
    	)
    	return (
    		<div>	
    			<ReactTooltip id="sidebar" place="top" data-border={true} className="bg-success text-white font-weight-bold" effect="solid"/>
				<nav id="sidebar" className={`text-white position-fixed h-100 ${this.props.active ? 'active' : ''}`}>
		            <div className="sidebar-header px-2 py-3">
		                <h6 className="m-0 text-white font-weight-bold text-uppercase"><NavLink exact to='/'>{this.props.title}</NavLink></h6>
		                <strong><NavLink exact to='/'>{this.props.shortname}</NavLink></strong>
		            </div>
		            <ul className="list-unstyled">
		                {elements}  
		            </ul>
		        </nav>
    		</div>
    	)
    }
}