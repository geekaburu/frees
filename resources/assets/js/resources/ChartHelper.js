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

export function displayUnit(filter){
	const formats = {
		'live':'hour',
		'today':'hour',
		'week':'day',
		'month':'day',
		'3month':'month',
		'year':'month',
	}
	return formats[filter]
}

export function displayParser(filter){
	const formats = {
		'live':'YYYY-MM-DD HH:mm:ss',
		'today':'YYYY-MM-DD HH:mm:ss',
		'week':'YYYY-MM-DD HH:mm:ss',
		'month':'YYYY-MM-DD HH:mm:ss',
		'3month':'MMMM YYYY',
		'year':'MMMM YYYY',
	}
	return formats[filter]
}