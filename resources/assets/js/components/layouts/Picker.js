import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'

import 'react-datepicker/dist/react-datepicker.css'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'

export default class Picker extends Component {
	constructor(props) {
        super(props);
        this.state = {
            startDate: null,
        }
        this.handleDateChange = this.handleDateChange.bind(this)
    }	

	// Handle date change
	handleDateChange(date){
		this.setState({
	      startDate: date
	    }, ()=>{
            if(date)return this.props.handleDateModification(this.props.id, date.format('DD/MM/YYYY')) 
            else return this.props.handleDateModification(this.props.id, null)	    	
	    });
	}

    render() {
    	var props = this.props
    	return (
			<DatePicker selected={this.state.startDate} {...props} onChange={this.handleDateChange} />
    	)
    }
}