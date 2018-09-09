import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactSpeedometer from 'react-d3-speedometer'
import { NavLink, Link } from 'react-router-dom'

import Chart from '../layouts/Chart'
import Loader from '../layouts/Loader';
import { chartData } from '../../resources/ChartHelper'

export default class PanelAnalysis extends Component {
	constructor(props) {
        super(props)
        this.state = {
            chart: { datasets:[], labels:[], filter:'month'},
            panels: [],
            initialPanels:[],
            activePanel:'',
            filter: this.props.match.params.number,
            stats: '',
        }
        this.handleFilterValue = this.handleFilterValue.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.fetchData = this.fetchData.bind(this)
    }

	// Get data when the component loads
    componentDidMount(){
    	// Set loader to true
    	this.setState({loader:true})
    	// Fetch data
    	this.fetchData()
    	// Apply fetch duration
    	this.timerID = setInterval(
			() => this.fetchData(),
			App.fetchDuration(),
    	)      	
    }

	// Tear down the interval 
    componentWillUnmount() {
	    clearInterval(this.timerID);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			loader:true,
			filter:nextProps.match.params.number,
		},()=>{
			this.fetchData()					
		})
    }

	fetchData(){
		axios.post('api/customers/panel-analysis', {
      		chart_filter: this.state.chart.filter,	
      		panel: this.state.filter,	
    	})
    	.then((response) => {
    		var chart = chartData(response.data.chart.data, ['energy'])
    		chart.filter = this.state.chart.filter
    		this.setState({
				loader:false,
				chart: chart,
    			panels: response.data.panels.map(function(e) { return e.id}),
    			initialPanels: response.data.panels.map(function(e) { return e.id}),
    			stats: response.data.stats,
    			activePanel: response.data.activePanel,
			})
    	})
    	.catch((error) => {
    		if(User.hasTokenHasExpired(error.response.data)){
    			this.props.history.push('/login')
    		}
    	})			
	}

	handleSearch(event){
		var panels= this.state.initialPanels
		panels = panels.filter( panel => {
			return panel == event.target.value
		})
		this.setState({panels})	    
	}

	handleFilterValue(value){
		this.setState({
			loader:true,
			chart:{
				datasets:'', 
				labels:'', 
				filter: value 
			}
		}, ()=>{
			this.fetchData()
		})
	}

    render() {
    	const panels = this.state.panels.map((panel)=>(
    		<div key={panel} className="row">
				<NavLink className="col-12 py-2 px-0 border-white border-bottom text-white" to={`/panel-analysis/panels/${panel}`}>
					<FontAwesomeIcon icon="qrcode" size="lg" className="mr-2" />
					Panel #{panel}
				</NavLink>
			</div>	
    	))

    	return (
			<div id="carbon-reports" className="row m-0">
				<Loader load={this.state.loader} /> 
				<div className="col-12 col-lg-2 bg-dark-primary panel-nav-bar px-0 mb-1" style={{ boxShadow: '1px 2px 2px rgba(0, 0, 0, 0.7)' }}>	
					<input placeholder="Search" type="text" className="w-100 form-control rounded-0" onChange={this.handleSearch}/>	
					<div className="side-selector bg-dark-primary">
						<div className="row">
							<NavLink className="col-12 py-2 px-0 border-white border-bottom text-white" to={`/panel-analysis/panels/all`}>
								<FontAwesomeIcon icon="qrcode" size="lg" className="mr-2" />
								All Panels
							</NavLink>
						</div>					
						{panels}					
					</div>
				</div>
				<div className="col-12 col-lg-10 p-0 pl-lg-2">
					<div className="row mx-0">
						<div className="col-12 card-shadow">
							<div className="row">
								<div className="col-12 col-md-3 py-2 text-white bg-dark-secondary border border-white">
									Energy Collected : {this.state.stats.energy} kWh
								</div>
								<div className="col-12 col-md-3 py-2 text-white bg-dark-secondary border border-white">
									{ this.state.filter == 'all' ? (<span>N/A</span>) : (<span>Voltage : {this.state.activePanel.voltage}V</span>)}
								</div>
								<div className="col-12 col-md-3 py-2 text-white bg-dark-secondary border border-white">
									{ this.state.filter == 'all' ? (<span>N/A</span>) : (<span>Power : {this.state.activePanel.power}w</span>)}
								</div>
								<div className="col-12 col-md-3 py-2 text-white bg-dark-secondary border border-white">
									{ this.state.filter == 'all' ? (<span>N/A</span>) : (<span>Active From : {(new Date(this.state.activePanel.created_at)).toLocaleDateString('en-GB')}</span>)}
								</div>
							</div>
						</div>
					</div>
					<div className="row mx-0 mt-1">
						<div className="col-12 card-shadow pb-3">
							<Chart
								data={ this.state.chart }
								width={ 100 }
								height={ 350 }
								title='Energy Collection against Time'
								axesLabels = {{
									yAxes:'Energy in kWh',
									'xAxes': 'Time'
								}}
								filters={[{label: 'Live', value:'live'}, {label: 'Today', value:'today'}, , {label: 'This Week', value:'week'}, {label: 'This Month', value:'month'}, {label: 'Past 3 Months', value:'3month'}, {label: 'This Year', value:'year'}]}
								activeFilter='month'
								handleFilterValue={this.handleFilterValue}
							/>
						</div>
					</div>
					<div className="row mx-0 mt-1">
						<div className="col-12 mt-1 bg-dark-secondary text-white card-shadow">
							<div className="row">
								<div className="col-12 col-lg text-center border py-3">
									<div className="w-100" style={{
									    height: '120px'
									}}>
										<ReactSpeedometer
											fluidWidth={true}
											maxValue={6}
										  	value={parseFloat(this.state.stats.voltage)}
										  	width={200}
										  	height={250}
										  	needleColor="rgb(220, 53, 69)"
										  	segments={5}
										  	textColor="#fff"
										  	needleTransitionDuration={4000}
										  	needleTransition="easeElastic"
										  	currentValueText={String(this.state.stats.voltage)}
										  	ringWidth={40}
										/>
									</div>
									<div className="col-12">Avg Voltage</div>
								</div>
								<div className="col-12 col-lg text-center border py-3">
									<div className="w-100" style={{
									    height: '120px'
									}}>
										<ReactSpeedometer
											fluidWidth={true}
											maxValue={1.5}
										  	value={parseFloat(this.state.stats.power)}
										  	width={200}
										  	height={250}
										  	needleColor="rgb(23, 162, 184)"
										  	segments={5}
										  	textColor="#fff"
										  	needleTransitionDuration={4000}
										  	needleTransition="easeElastic"
										  	currentValueText={String(this.state.stats.power)}
										  	ringWidth={40}
										/>
									</div>
									<div className="col-12">Avg Power</div>
								</div>
								<div className="col-12 col-lg text-center border py-3">
									<div className="w-100" style={{
									    height: '120px'
									}}>
										<ReactSpeedometer
											fluidWidth={true}
											maxValue={5000}
										  	value={parseFloat(this.state.stats.energy)}
										  	width={200}
										  	height={250}
										  	needleColor="purple"
										  	segments={5}
										  	textColor="#fff"
										  	needleTransitionDuration={4000}
										  	needleTransition="easeElastic"
										  	currentValueText={String(this.state.stats.energy)}
										  	ringWidth={40}
										/>
									</div>
									<div className="col-12">Energy</div>
								</div>
								<div className="col-12 col-lg text-center border py-3">
									<div className="w-100" style={{
									    height: '120px'
									}}>
										<ReactSpeedometer
											fluidWidth={true}
											maxValue={5}
										  	value={parseFloat(this.state.stats.credits)}
										  	width={200}
										  	height={250}
										  	needleColor="green"
										  	segments={5}
										  	textColor="#fff"
										  	needleTransitionDuration={4000}
										  	needleTransition="easeElastic"
										  	currentValueText={String(this.state.stats.credits)}
										  	ringWidth={40}
										/>
									</div>
									<div className="col-12">Credits</div>
								</div>
								<div className="col-12 col-lg text-center border py-3">
									<div className="w-100" style={{
									    height: '120px'
									}}>
										<ReactSpeedometer
											fluidWidth={true}
											maxValue={12000}
										  	value={parseFloat(this.state.stats.amount)}
										  	width={200}
										  	height={250}
										  	needleColor="blue"
										  	segments={5}
										  	textColor="#fff"
										  	needleTransitionDuration={4000}
										  	needleTransition="easeElastic"
										  	currentValueText={String(this.state.stats.amount)}
										  	ringWidth={40}
										/>
									</div>
									<div className="col-12">Value</div>
								</div>
							</div>
						</div>
					</div>
				</div>
		    </div>
    	)
    }
}