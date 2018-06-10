
<table cellspacing="2" cellpadding="2" style="font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
	@foreach ($module->fields as $key => $field)
	<tr>
		<td><strong>{{ $field['label'] }}</strong></td>
		<td>
		     {{ $contact_data->$key }}
		</td>
		
	</td>
	</tr>
	@endforeach
	<tr>
		<td><strong>Date Submitted</strong></td>
		<td>{{ date("M d, Y h:iA", strtotime($contact_data->created_at)) }} </td>
	</tr>
	
</table>

