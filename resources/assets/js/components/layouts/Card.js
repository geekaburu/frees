import React, { Component } from 'react';

export default class Card extends Component {
    render() {
    	return (
			<div style={{height:this.props.height}} className="card rounded-0">
				<div className="card-header text-white rounded-0 py-2 font-weight-bold">{this.props.header}</div>
				<div className="card-body p-0">
					{this.props.body}
  				</div>
			</div>
    	)
    }
}