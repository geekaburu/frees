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
            loader:true,
            customerData:[],
            chart: { datasets:[], labels:[], filter:'today' },
            panels:'',
        }
        this.fetchData = this.fetchData.bind(this)
        this.handleFilterValue = this.handleFilterValue.bind(this)
    }	

   // Get data when the component loads
    componentDidMount(){
    	this.fetchData()      	
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
    			customerData:data.customerData,
    			panels: table,
    			chart: chartData(data.chart.data, ['temperature', 'energy', 'intensity', 'humidity']),
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
			chart:{
				datasets:this.state.chart.datasets, 
				labels:this.state.chart.labels, 
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
				defaultZoom={ 6 }
				mapTypeId='roadmap'
				contentWidth='100%'
				contentHeight='450px'				
				markers={this.state.customerData}
			/>
    	)

		// Create an instance of the chart component
        const chart = (
			<Chart
				data={ this.state.chart }
				width={ 100 }
				height={ 325 }
				handleFilterValue={this.handleFilterValue}
				options={{
					maintainAspectRatio: false,
					legend: {
			            display: true,
			            position: 'bottom',
			        },
					title: {
			            display: true,
			            text: 'Energy Vs Time'
			        },
			        scales: {
			            yAxes: [{
			            	scaleLabel: {
					        	display: true,
					        	labelString: 'Energy in kWh',
					        	fontColor:'rgba(4, 33, 47, 1)',
					      	}
					    }],
					    xAxes: [{
			            	scaleLabel: {
					        	display: true,
					        	labelString: 'Time',
					        	fontColor:'rgba(4, 33, 47, 1)',
					      	}
					    }]
			        }
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
							searching={false} 
							withFooter={true} 
							defs={[{
				                'render': function ( data, type, row ) {
				                    return parseFloat(data).toFixed(2);
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
				<div className="col-7 p-0 pr-1">
					<div className="row">
						<div className="col-12">
							<Card header="Location" body={map} />
						</div>
					</div>
				</div>
				<div className="col-5">
					<div className="row">
						<div className="col-12 p-0">
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