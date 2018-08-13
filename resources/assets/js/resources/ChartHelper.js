export function chartData (chart, dataSets) {
	var datasets = []
	dataSets.map((dataSet) => {
		if(dataSet == 'energy'){
			datasets.push({
		        label: "Energy Collection",
		        backgroundColor: 'transparent',
		        borderColor: 'rgb(40, 167, 69)',
		        data: chart.map(function(e) { return e.energy }),
			})
		}
	})
	return {
		labels: chart.map(function(e) { return e.label}),
		datasets: datasets
	}
}