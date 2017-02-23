<h3>{{tableTitle}}</h3>
<table id="{{tableId}}" class="pure-table pure-table-bordered" style="margin:auto;">
	<thead>
		<tr>
			{{#heads}}
			<th>{{.}}</th>
			{{/heads}}
		</tr>
	</thead>
	<tbody>
		{{#rows}}
		<tr>
			{{#values}}
			<td>{{{.}}}</td>
			{{/values}}
		</tr>
		{{/rows}}
	</tbody>
</table>