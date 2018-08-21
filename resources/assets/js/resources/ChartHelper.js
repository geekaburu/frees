export function chartData (chart, dataSets, filter) {
	var datasets = []
	dataSets.map((dataSet) => {
		if(dataSet == 'energy'){
			datasets.push({
				type:'line',
		        label: 'Energy Collection',
		        backgroundColor: 'transparent',
		        borderColor: 'rgb(40, 167, 69)',
		        data: chart.map(function(e) { return e.energy }),
			})
		}
		if(dataSet == 'rate'){
			datasets.push({
				type:'bar',
				fill:false,
		        label: 'Carbon Price',
		        backgroundColor: 'rgba(40, 167, 69, 1)',
		        borderColor: 'rgba(40, 167, 69, 1)',
		        data: chart.map(function(e) { return e.price}),
			})
		}
		if(dataSet == 'price'){
			datasets.push({
				type:'line',
				fill:false,
		        label: 'Carbon Rate',
		        borderColor: 'rgb(4, 33, 47)',
		        data: chart.map(function(e) { return e.rate}),
			})
		}
	})
	return {
		labels: chart.map(function(e) { return e.label}),
		datasets: datasets,
		filter: filter,
	}
}