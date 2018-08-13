import React, { Component } from 'react';

export default class Modal extends Component {
    render() {
    	return (
    		<div>
	    		<a href="#" className={this.props.buttonStyle} data-toggle="modal" data-target={'#'+ this.props.id}>{this.props.buttonText}</a>
				<div className="modal fade" id={this.props.id} tabIndex="-1" role="dialog" aria-labelledby={this.props.id + 'Label'} aria-hidden="true">
				    <div className="modal-dialog modal-md" role="document">
				        <div className="modal-content">
				            <div className="modal-header">
				                <h5 className="modal-title" id={this.props.id + 'Label'}>{this.props.title}</h5>
				                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
				                    <span aria-hidden="true">&times;</span>
				                </button>
				            </div>
				            <div className="modal-body text-left">
				                {this.props.body}
				            </div>
				            <div className="modal-footer text-left">
				                {this.props.footer}
				            </div>
				        </div>
				    </div>
				</div>
			</div>
    	)
    }
}