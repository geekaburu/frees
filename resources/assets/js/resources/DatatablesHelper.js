import moment from 'moment'

export function renderRow (id, data) {
	var elements = '' 
	data.map((element) => (
		elements+= `
			<tr>
				<td>${element.name}</td>
				<td>${element.county}</td>
				<td>${parseFloat(element.energy)}</td>
				<td>${parseFloat(element.credits)}</td>
				<td>${parseFloat(element.amount)}</td>
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
			column.data().reduce( function( a , b ) {
				return ( parseFloat( b ? b : 0 ) + parseFloat( a ? a : 0 ) )
			}, 0).toLocaleString('en' , { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
		columnDefs: parameters.columnDefs,
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

export function renderButton (options) {
	var buttonOptions = []

	// Add the print button
	options.print && buttonOptions.push({
        extend: 'print',
        footer: options.print.footer,
        pageSize: options.print.pageSize,
        orientation: options.print.orientation,
        title: 	`<h3 class="my-4 text-center text-success font-weight-bold">${options.print.title}</h3>`,
        exportOptions: {
            columns: options.print.columns
        },
        customize: function ( win ) {
            $(win.document.body)
                .css( 'font-size', '10pt' )
                .prepend(
                    `
                    	<div class="row my-3">
                        	<div class="col-12 text-center">
                            	<img style="width:150px;" class="img-fluid mx-auto d-block" src="${options.print.image}"/>
                        	</div>
                    	</div>
                    `
                );

            $(win.document.body).find( 'table' )
                .addClass( 'compact' )
                .css( 'font-size', 'inherit' );
        }
    })

    // Add column visibility
    options.columnVisibility && buttonOptions.push('colvis')
    
    return buttonOptions
}
