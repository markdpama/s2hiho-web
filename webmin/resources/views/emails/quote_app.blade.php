
<table cellspacing="2" cellpadding="2" style="font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
	@foreach ($module->fields as $key => $field)
	<tr>
		<td><strong>{{ $field['label'] }}</strong></td>
		<td>
			@if(starts_with($quote_my_app->{$key}, "["))
				@php
	        	$values = json_decode( $quote_my_app->{$key} );
	        	@endphp
		        @foreach($values as $val) 
		            <span style="color:#FFF; font-size: 90%; display: inline-block; padding: .2em .6em .3em;  border-radius: .25em;  background-color: #48B0F7;">{{ $val }}</span>
		        @endforeach
		    @else
		        {{ $quote_my_app->$key }}
		    @endif
		</td>
		
	</td>
	</tr>
	@endforeach
	<tr>
		<td><strong>Date Submitted</strong></td>
		<td>{{ date("M d, Y h:iA", strtotime($quote_my_app->created_at)) }} </td>
	</tr>
	
</table>

