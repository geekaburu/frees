import moment from 'moment'

export function renderRow (id, data) {
	var elements = '' 
	data.map((element) => (
		elements+= `
			<tr>
				<td>${element.name}</td>
				<td>${element.county}</td>
				<td>${element.energy}</td>
				<td>${element.credits}</td>
				<td>${element.amount}</td>
			</tr>`					
    	)
    )
	return `
		<div class="row justify-content-center">
			<div class="col-12 py-2 px-4">
        		<table id="details${id}" class="table details-table">
        			<thead class="thead-dark">
						<tr>
							<th>Customer</th>
							<th>County</th>
							<th>Energy (Kwh)</th>
							<th>Credits</th>
							<th>Amount Earned</th>
						</tr>
        			</thead>
        			<tbody>
        				${elements}
        			</tbody>
        			<tfoot>
						<tr>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
							<th></th>
						</tr>
        			</tfoot>
        		</table>
			</div>
		</div>
	`
}

export function sumFooterColumns (type, row, data, start, end, display){
	const columns = Array.prototype.slice.call(arguments)[5]
	this.api().columns(columns, {filter:'applied'}).every( function () {
		var column = this
		$(column.footer()).html(
			column.data().reduce( function(a,b) {
				return (parseFloat(a) + parseFloat(b)).toFixed(2)
			}, 0)
		)		
	})	
}

export function addSelectSearching (type, row, data, start, end, display){
	const columns = Array.prototype.slice.call(arguments)[2]
	this.api().columns(columns).every( function () {
        var column = this;
        var select = $('<select class="form-control form-control-sm"><option value=""></option></select>')
            .appendTo( $(column.footer()).empty() )
            .on( 'change', function () {
                var val = $.fn.dataTable.util.escapeRegex(
                    $(this).val()
                );
                column
                    .search( val ? '^'+val+'$' : '', true, false )
                    .draw();
            } );

        column.data().unique().sort().each( function ( d, j ) {
            select.append( '<option value="'+d+'">'+d+'</option>' )
        } );
    } );
}
export function createDatatable (table, parameters) {
	// Create a datatable
	$(table).DataTable({
		footerCallback: function (){
			if(parameters.sumColumns){
				var newArguments = Array.prototype.slice.call(arguments)
				newArguments.push(parameters.sumColumns)
				sumFooterColumns.apply(this, newArguments)				
			}
		},
		initComplete: function () {
			if(parameters.selectSearchColumns){
				var newArguments = Array.prototype.slice.call(arguments)
				newArguments.push(parameters.selectSearchColumns)
				addSelectSearching.apply(this, newArguments)	
			}
        }
	})
}

export function createFooter(table, columsLength) {
	var elements = ''
	for(var i = 0; i< columsLength; i++)
		elements+='<th></th>'
	table.append(`<tfoot><tr>${elements}</tr></tfoot>`)
}

export function destroyDatatable (table) {
	// Destroy datatable
	$(table).DataTable().destroy(true)
}