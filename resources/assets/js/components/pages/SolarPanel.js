import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import ReactSpeedometer from 'react-d3-speedometer'

import Map from '../layouts/Map'
import Card from '../layouts/Card'
import Chart from '../layouts/Chart'
import Alert from '../layouts/Alert'
import Loader from '../layouts/Loader';
import DataTable from '../layouts/DataTable'
import RangeSlider from '../layouts/RangeSlider'
import ConditionMeter from '../layouts/ConditionMeter'
import { chartData } from '../../resources/ChartHelper'

class SolarPanel extends Component {
	constructor(props) {
        super(props)
        this.state = {
            alert:{ display:false, type:'', title:'' ,body:'' },
            conditions:'',
            controls:{
            	angle: 0
            },
            chart: { datasets:[], labels:[], filter:'month' },
            panels: '',
        }
        this.handleRadioChange = this.handleRadioChange.bind(this)
        this.handleModeUpdate = this.handleModeUpdate.bind(this)
        this.handleRuntimeChange = this.handleRuntimeChange.bind(this)
        this.handleModalDismiss = this.handleModalDismiss.bind(this)
        this.handleFilterValue = this.handleFilterValue.bind(this)
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
			() => this.fetchData({map:false}),
			App.fetchDuration(),
    	)      	
    }

	// Tear down the interval 
    componentWillUnmount() {
	    clearInterval(this.timerID);
	}

	fetchData(){
		axios.post('api/customers/panel-data', {
      		chart_filter: this.state.chart.filter,	
    	})
    	.then((response) => {
    		const data = response.data
    		var table = {
    			data: data.panels.data,
    			columns: [
					{ title: 'Panel ID', data: 'panel_id' },
            		{ title: 'Energy (Kwh)', data: 'energy' },
            		{ title: 'User', data: 'user_id' },
            		{ title: 'Credits Earned', data: 'credits' },
            		{ title: 'Gross Amount', data: 'gross_amount' },
            		{ title: 'Commission Payment', data: 'commission' },
            		{ title: 'Net Amount', data: 'amount' },
    			]
    		}
    		this.setState({
				locationData: data.locationData,
				conditions: data.conditions,
				controls: data.controls,
				chart: chartData(data.chart.data, ['energy'], this.state.chart.filter),
				panels: table,
				loader: false,
				angle: data.controls.angle,
			})
    	})
    	.catch((error) => {
    		if(User.hasTokenHasExpired(error.response.data)){
    			this.props.history.push('/login')
    		}
    	})
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
	
	// When the radio buttons that control the mode are changed
    handleRadioChange(event){
	    this.setState({
	        controls : {
	        	mode: event.target.value,
	        	runtime:this.state.controls.runtime,
	        	angle: this.state.controls.angle,
	        }
	    })
    }

    // handle what happens when the run time field is updated. 
	handleRuntimeChange(event){
		this.setState({
	        controls : {
	        	mode: this.state.controls.mode,
	        	runtime:event.target.value,
	        	angle: this.state.controls.angle,
	        }
	    })
	}
	
	// handle the change of the panel controls
    handleModeUpdate(){
    	this.setState({loader:true})
    	axios.post('api/customers/update-controls', {	
    		runtime:this.state.controls.runtime,
    	})
    	.then((response) => {
    		this.setState({
    			loader:false,
    			alert:{display:true,type:'success',title:'Success',body:response.data.message},
    		})
    	})
    	.catch((error) => {
    		this.setState({loader:false})
    		if(User.hasTokenHasExpired(error.response.data)){
    			this.props.history.push('/login')
    		}
    	})    		
    }

	// Handle the dismiss of the alert modal
	handleModalDismiss(state){
    	if(state){
    		this.setState({
    			alert:{display:false,type:'',title:'',body:''}
    		})
    	}
    }

    render() {
    	const data = [this.state.locationData]
    	const map = (
			this.state.locationData && <Map 
				defaultCenter={ {lat: Number(this.state.locationData.location.latitude), lng: Number(this.state.locationData.location.longitude)} } 
				zoom={ 17 }
				mapTypeId='hybrid'
				contentWidth='100%'
				contentHeight='300px'				
				markers={data}
				link='/panel-analysis/panels/all'
			/>
    	)

    	// Creating the condition meter
    	const conditions = (
    		<ConditionMeter 
    			containerHeight={300} 
    			barHeight={250}
    			voltage= { parseFloat(this.state.conditions.voltage).toLocaleString('en' , { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
    			power= { parseFloat(this.state.conditions.power).toLocaleString('en' , { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
    			energy= { parseFloat(this.state.conditions.energy).toLocaleString('en' , { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
    		/>    	
    	)

    	// Creating the mode control section
		const mode = (
			<div style={{height:'450px'}} className="row text-center justify-content-center py-4 align-items-center">				
				<div className="col-11 col-md-9">
					<div className="w-100" style={{
					    height: '300px'
					}}>
						<ReactSpeedometer
							fluidWidth={true}
							maxValue={180}
						  	value={parseInt(this.state.controls.angle)}
						  	width={250}
						  	height={250}
						  	needleColor="red"
						  	segments={10}
						  	textColor="black"
						  	needleTransitionDuration={4000}
						  	needleTransition="easeElastic"
						  	currentValueText=''
						  	ringWidth={40}
						/>
					</div>
					<h4 className="font-weight-bold">Current Position : <span className="text-success">{this.state.controls.angle} Degrees</span> </h4>
				</div>
			</div>
		)

		// Create a datatable
		const datatable = (
			<div className="row justify-content-center py-4 m-0">				
				<div className="col-12">
					{ this.state.panels.columns 
						? <DataTable 
							data={this.state.panels.data}
							columns={this.state.panels.columns}
							order = {[[ 1, 'desc' ]]}
							searching={ false }
							print = {{
								footer: true,
			        			pageSize: 'A4',
			        			orientation: 'landscape',
			        			title: 'Solar Panel Data this Month',
			        			columns: ':visible',
			        			image: App.asset(`img/icon/icon.png`),
							}}
							columnVisibility = { true } 
							defs={[{
				                'render': function ( data, type, row ) {
				                    return parseFloat(data).toLocaleString('en' , { minimumFractionDigits: 2, maximumFractionDigits: 2 })
				                },
					                'targets': [ 1, 3, 4, 5, 6]
					            },{
						            "targets": [ 2 ],
						            "visible": false,
						            "searchable": false
						        }
					        ]}
							sumColumns = {[ 1, 3, 4, 5, 6]}
							withFooter = { true } 
						/>
						: '' 
					}
				</div>
			</div>
		)
		// Create an instance of the chart component
        const chart = (
        	<div>
				<Chart
					data={ this.state.chart }
					height={ 410 }
					handleFilterValue={this.handleFilterValue}
					filters={[{label: 'Live', value:'live'}, {label: 'Today', value:'today'}, {label: 'This Week', value:'week'},{label: 'This Month', value:'month'}, {label: 'Past 3 Months', value:'3month'}, {label: 'This Year', value:'year'}]}
					activeFilter='month'
					title='A Graph of Energy Against Time'
					axesLabels = {{
						yAxes:'Energy in kWh',
						'xAxes': 'Time'
					}}
				/>        		
        	</div>
        )
    	return (
			<div id="solar-panel" className="row m-0">
				{/* Include loader and alert boxes */}
				<Loader load={this.state.loader} />  
				{ this.state.alert.display && 
    				<Alert backdrop ='static' keyboard={false} focus={true} show={true} title={this.state.alert.title} body={this.state.alert.body} type={this.state.alert.type} dismissModal={this.handleModalDismiss} />
    			}  		
    			{/* Begining of the page */}
				<div className="col-12">
					<div className="row">
						<div className="col-12 col-lg-9 p-0 pr-lg-1">
							<Card header="Location" body={map} />
						</div>
						<div className="col-12 col-lg-3 p-0">
							<Card header="Average Panel Readings" body={conditions}/>
						</div>
						<div className="col-12">
							<div className="row">
								<div className="col-12 col-lg-6 p-0 pr-lg-1 mt-1">
									<Card header="Solar Panel Angle" body={mode} />
								</div>
								<div className="col-12 col-lg-6 p-0 mt-1">
									<Card header="Energy Readings" body={chart}  />
								</div>
							</div>
						</div>
						<div id="panels" className="col-12">
							<div className="row">
								<div className="col-12 p-0 mt-1">
									<Card header="Solar Panel Data this Month" body={ datatable }/>
								</div>
							</div>
						</div>
					</div>
				</div>
		    </div>
    	)
    }
}

export default withRouter(SolarPanel)