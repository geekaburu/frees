import React, { Component } from 'react'

import Card from '../../layouts/Card'
import Map from '../../layouts/Map'
import Chart from '../../layouts/Chart'
import DataTable from '../../layouts/DataTable'
import Loader from '../../layouts/Loader'
import { chartData } from '../../../resources/ChartHelper'

export default class Customers extends Component {
	constructor(props) {
        super(props)
        this.state = {
            customerData:[],
            chart: { datasets:[], labels:[], filter:'month' },
            panels:'',
        }
        this.fetchData = this.fetchData.bind(this)
        this.handleFilterValue = this.handleFilterValue.bind(this)
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

    fetchData(){
		axios.post('api/admin/customer-data', {
			chart_filter: this.state.chart.filter,
		})
		.then((response) => {
			const data = response.data
    		var table = {
    			data: data.panels.data,
    			columns: [
					{ title: 'Id', data: 'id' },
					{ title: 'Customer', data: 'name' },
            		{ title: 'Energy (Kwh)', data: 'energy' },
            		{ title: 'Credits Earned', data: 'credits' },
            		{ title: 'Amount Earned', data: 'amount' },
    			]
    		}
    		this.setState({
    			loader:false,
    			customerData: data.customerData,
    			panels: table,
    			chart: chartData(data.chart.data, ['energy'], this.state.chart.filter),
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

    render() {
    	const map = (
			<Map 
				defaultCenter={ {lat: 0.0236, lng: 37.9062} } 
				zoom={ 6 }
				mapTypeId='roadmap'
				contentWidth='100%'
				contentHeight='470px'				
				markers={this.state.customerData}
			/>
    	)

		// Create an instance of the chart component
        const chart = (
			<Chart
				data={ this.state.chart }
				width={ 100 }
				height={ 430 }
				handleFilterValue={this.handleFilterValue}
				filters={[{label: 'Live', value:'live'},{label: 'Today', value:'today'},{label: 'This Week', value:'week'},{label: 'This Month', value:'month'}, {label: 'Past 3 Months', value:'3month'}, {label: 'This Year', value:'year'}]}
				activeFilter='month'
				title='A Graph of Energy Against Time'
				axesLabels = {{
					yAxes:'Energy in kWh',
					'xAxes': 'Time'
				}}
			/>
        )

		// Create a datatable
		const datatable = (
			<div className="row justify-content-center py-4 m-0">				
				<div className="col-12">
					{ this.state.panels.columns 
						? <DataTable 
							data={this.state.panels.data}
							columns={this.state.panels.columns}
							searching={ false } 
							withFooter={ true } 
							print = {{
								footer: true,
			        			pageSize: 'A4',
			        			orientation: 'landscape',
			        			title: 'Customer Credit Data this Month',
			        			columns: ':visible',
			        			image: App.asset(`img/icon/icon.png`),
							}}
							columnVisibility = { true } 
							defs={[
								{
					                'render': function ( data, type, row ) {
					                    return parseFloat(data ? data : 0).toLocaleString('en' , { minimumFractionDigits: 2, maximumFractionDigits: 2 })
					                },
					                'targets': [2,3,4]
						        }
					        ]}
							sumColumns={[2,3,4]}
						/>
						: '' 
					}
				</div>
			</div>
		)

    	return (
			<div id="solar-panel" className="row m-0">
				<Loader load={this.state.loader} />  
				<div className="col-lg-6 col-12 px-0">
					<div className="row">
						<div className="col-12">
							<Card header="Location" body={map} />
						</div>
					</div>
				</div>
				<div className="col-lg-6 co-12 px-0 pl-lg-1 mt-2 mt-lg-0">
					<div className="row">
						<div className="col-12">
							<Card header="Customer Energy Collection" body={chart} />
						</div>
					</div>
				</div>
				<div id="panels" className="col-12 mt-1">
					<div className="row">
						<div className="col-12 p-0 mt-1">
							<Card header="Customer Credit Data this Month" body={datatable} />
						</div>
					</div>
				</div>
		    </div>
    	)
    }
}