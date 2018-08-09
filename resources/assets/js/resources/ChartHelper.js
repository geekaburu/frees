export function chartData (chart, dataSets) {
	var datasets = []
	dataSets.map((dataSet) => {
		if(dataSet == 'temperature'){
			datasets.push({
		        label: 'Temperature',
		        backgroundColor: 'transparent',
		        borderColor: 'rgb(220, 53, 69)',
		        data: chart.map(function(e) { return e.temperature }),
			})
		}
		if(dataSet == 'energy'){
			datasets.push({
		        label: "Energy Collection",
		        backgroundColor: 'transparent',
		        borderColor: 'rgb(40, 167, 69)',
		        data: chart.map(function(e) { return e.energy }),
			})
		}
		if(dataSet == 'intensity'){
			datasets.push({
		        label: 'Solar Intensity',
		        backgroundColor: 'transparent',
		        borderColor: 'rgb(255, 193, 7)',
		        data: chart.map(function(e) { return e.intensity }),
			})
		}
		if(dataSet == 'humidity'){
			datasets.push({
		        label: 'Humidity',
		        backgroundColor: 'transparent',
		        borderColor: 'rgb(23, 162, 184)',
		        data: chart.map(function(e) { return e.humidity }),
			})
		}
	})
	return {
		labels: chart.map(function(e) { return e.label}),
		datasets: datasets
	}
}