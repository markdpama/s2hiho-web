@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/contact_datas') }}">Contact Data</a> :
@endsection
@section("contentheader_description", $contact_data->$view_col)
@section("section", "Contact Datas")
@section("section_url", url(config('laraadmin.adminRoute') . '/contact_datas'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Contact Datas Edit : ".$contact_data->$view_col)

@section("main-content")

@if (count($errors) > 0)
    <div class="alert alert-danger">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="box">
	<div class="box-header">
		
	</div>
	<div class="box-body">
		<div class="row">
			<div class="col-md-8 col-md-offset-2">
				{!! Form::model($contact_data, ['route' => [config('laraadmin.adminRoute') . '.contact_datas.update', $contact_data->id ], 'method'=>'PUT', 'id' => 'contact_data-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'first_name')
					@la_input($module, 'last_name')
					@la_input($module, 'email')
					@la_input($module, 'country')
					@la_input($module, 'message')
					@la_input($module, 'form')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/contact_datas') }}">Cancel</a></button>
					</div>
				{!! Form::close() !!}
			</div>
		</div>
	</div>
</div>

@endsection

@push('scripts')
<script>
$(function () {
	$("#contact_data-edit-form").validate({
		
	});
});
</script>
@endpush
