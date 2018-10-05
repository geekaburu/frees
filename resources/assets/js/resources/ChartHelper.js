export function chartData (chart, dataSets, filter) {
	var datasets = []
	dataSets.map((dataSet) => {
		if(dataSet == 'energy'){
			datasets.push({
				type:'line',
		        label: 'Energy Collection',
		        borderColor: 'rgb(40, 167, 69)',
		        backgroundColor: 'rgba(40, 167, 60, 0.2)',
		        data: chart.map(function(e) { return e.energy }),
			})
		}
		if(dataSet == 'rate'){
			datasets.push({
				type:'line',
		        label: 'Carbon Price',
		        backgroundColor: 'rgba(40, 167, 69, 0.7)',
		        borderColor: 'rgba(40, 167, 69, 0.2)',
		        data: chart.map(function(e) { return e.price}),
			})
		}
		if(dataSet == 'price'){
			datasets.push({
				type:'line',
		        label: 'Carbon Rate',
		        borderColor: 'rgb(4, 33, 47)',
		        backgroundColor: 'rgba(4, 33, 47, 0.6)',
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
		'live':'second',
		'today':'minute',
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
		'week':'Do MMMM',
		'month':'Do MMMM',
		'3month':'MMMM YYYY',
		'year':'MMMM YYYY',
	}
	return formats[filter]
}

export function setTickValue(filter){
	return {
        maxRotation: 0,
        minRotation: 0,		
		autoSkip:false,
		maxTicksLimit: filter == 'live' ? 5 : 20,
		source:'data'
	}
}