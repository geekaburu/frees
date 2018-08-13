import React, { Component } from 'react';

export default class Alert extends Component {
	constructor(props) {
        super(props);
        this.handleDismiss = this.handleDismiss.bind(this)
        this.headerClass = this.headerClass.bind(this)
    }

    componentDidMount() {
		$(this.el).modal({
			backdrop:this.props.backdrop,
			keyboard:this.props.keyboard,
			focus:this.props.focus,
			show:this.props.show,
		})
	}

    handleDismiss(){
    	return this.props.dismissModal(true)
    }

	headerClass(type){
		if(type == 'success') return 'bg-success'
		if(type == 'error') return 'bg-danger'
	}
			
    render() {
    	return (
    		<div>
				<div className="modal fade" ref={el =>this.el = el} tabIndex="3" role="dialog" aria-labelledby="alertModalLabel" aria-hidden="true">
				    <div className="modal-dialog modal-dialog-centered" role="document">
				        <div className="modal-content">
				            <div className={`modal-header ${this.headerClass(this.props.type)}`}>
				                <h5 className="text-capitalize text-white modal-title font-weight-bold" id="alertModalLabel">{this.props.title}</h5>
				                <button type="button" className="close" data-dismiss="modal" onClick={this.handleDismiss} aria-label="Close">
				                    <span aria-hidden="true">&times;</span>
				                </button>
				            </div>
				            <div className="modal-body">{this.props.body}</div>
				        </div>
				    </div>
				</div>
			</div>
    	)
    }
}