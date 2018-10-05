import React, { Component } from 'react'
import {renderRow , createDatatable , destroyDatatable, createFooter, sumFooterColumns, addSelectSearching, renderButton } from '../../resources/DatatablesHelper'

// require( 'jszip' );
// require( 'pdfmake' );
require( 'datatables.net-bs4' )
require( 'datatables.net-buttons-bs4' )
require( 'datatables.net-buttons/js/buttons.print' )
require( 'datatables.net-buttons/js/buttons.colVis' );

let table = ''

export default class DataTable extends Component {
	constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
    	table.clear().rows.add(nextProps.data).draw()
    }

	componentDidMount() {
		// Declare the table element
		this.$el = $(this.el)

		// Create footer
		this.props.withFooter ? createFooter(this.$el, this.props.columns.length) : ''

		// Get columms to be summed up
		const sumColumns = this.props.sumColumns
		const searchSelect = this.props.searchSelect

		// Create datatable elements
		table = this.$el.DataTable({
			data: this.props.data,
			order:this.props.order,
			columnDefs:this.props.defs,
			columns: this.props.columns,
			searching:this.props.searching,
			lengthChange:this.props.lengthChange,
			scrollY: this.props.scrollY ? this.props.scrollY : true,
			scrollX: this.props.scrollX ? this.props.scrollX : true,
			dom: 'Bfrtip',
			buttons: renderButton({
				columnVisibility: this.props.columnVisibility,
				print: this.props.print,
			}),
			footerCallback:function(){
				if(sumColumns){
					var newArguments = Array.prototype.slice.call(arguments)
					newArguments.push(sumColumns)
					sumFooterColumns.apply(this, newArguments)		
				}
			},
			initComplete: function () {
				if(searchSelect){
					var newArguments = Array.prototype.slice.call(arguments)
					newArguments.push(searchSelect)
					addSelectSearching.apply(this, newArguments)	
				}
	        }
		})

		//Add event listener for opening and closing details
    	this.$el.on('click', 'td.details-control', function () {
    		const tr = $(this).closest('tr');
    		const row = table.row( tr );
    		
	        if ( row.child.isShown() ) {
	            row.child.hide();
	            tr.removeClass('shown');
	        } else {
	            row.child(renderRow(row.data().id, row.data().data)).show();
	            createDatatable('table#details' + row.data().id, {
	            	sumColumns:[ 2, 3, 4],
	            	selectSearchColumns: [ 0, 1],
	            	columnDefs: [{
				        'render': function ( data, type, row ) {
				                return parseFloat(data).toLocaleString('en' , { minimumFractionDigits: 2, maximumFractionDigits: 2 })
				            },
				            'targets': [ 2, 3, 4 ]
				        }
			        ]
	            })
	            tr.addClass('shown');
	        }
    	});
	}

	componentWillUnmount(){
		table.destroy(true)
	}

    render() {
    	return (
			<div>
				<table className="table w-100 table-striped table-bordered table-sm" ref={el =>this.el = el}></table>
			</div>
    	)
    }
}