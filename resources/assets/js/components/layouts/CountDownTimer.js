import React, { Component } from 'react'
import moment from 'moment'

export default class CountDownTimer extends React.Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		days:0,
    		hours:0,
    		minutes:0,
    		seconds:0,
    	};
  	}

  	componentDidMount() {
    	this.timerID = setInterval(
    		() => this.tick(), 
    	1000 );
    }

    componentWillUnmount() {
    	clearInterval(this.timerID);
  	}

  	tick() {
  		// Find the distance between now an the count down date
        const end = moment(this.props.endDate,'DD/MM/YYYY HH:ii:sss')
        const duration = moment.duration(end.diff(moment())).asMilliseconds()
    	this.setState({
    		days: Math.floor(duration / (1000 * 60 * 60 * 24)),
    		hours: Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    		minutes: Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60)),
    		seconds: Math.floor((duration % (1000 * 60)) / 1000),
    	});
    }

    render() {
    	return (
    		<div className="row m-0">
    			<div className="col-3 text-center bg-dark-primary px-0 py-2 border border-white">
    				<h5 className="text-white font-weight-bold m-0 p-0">{String(this.state.days)}</h5>
    				<p className="text-warning p-0 m-0">Days</p>
    			</div>
    			<div className="col-3 text-center bg-dark-primary px-0 py-2 border border-white">
    				<h5 className="text-white font-weight-bold m-0 p-0">{String(this.state.hours)}</h5>
    				<p className="text-warning p-0 m-0">Hours</p>
    			</div>
    			<div className="col-3 text-center bg-dark-primary px-0 py-2 border border-white">
    				<h5 className="text-white font-weight-bold m-0 p-0">{String(this.state.minutes)}</h5>
    				<p className="text-warning p-0 m-0">Minutes</p>
    			</div>
    			<div className="col-3 text-center bg-dark-primary px-0 py-2 border border-white">
    				<h5 className="text-white font-weight-bold m-0 p-0">{String(this.state.seconds)}</h5>
    				<p className="text-warning p-0 m-0">Seconds</p>
    			</div>
      		</div>
    	)
  	}
}