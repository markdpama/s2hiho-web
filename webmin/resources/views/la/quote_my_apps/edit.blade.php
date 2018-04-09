@extends("la.layouts.app")

@section("contentheader_title")
	<a href="{{ url(config('laraadmin.adminRoute') . '/quote_my_apps') }}">Quote My App</a> :
@endsection
@section("contentheader_description", $quote_my_app->$view_col)
@section("section", "Quote My Apps")
@section("section_url", url(config('laraadmin.adminRoute') . '/quote_my_apps'))
@section("sub_section", "Edit")

@section("htmlheader_title", "Quote My Apps Edit : ".$quote_my_app->$view_col)

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
				{!! Form::model($quote_my_app, ['route' => [config('laraadmin.adminRoute') . '.quote_my_apps.update', $quote_my_app->id ], 'method'=>'PUT', 'id' => 'quote_my_app-edit-form']) !!}
					@la_form($module)
					
					{{--
					@la_input($module, 'business_objectives')
					@la_input($module, 'platform')
					@la_input($module, 'app_type')
					@la_input($module, 'ecosystem')
					@la_input($module, 'ui_custom')
					@la_input($module, 'app_features')
					--}}
                    <br>
					<div class="form-group">
						{!! Form::submit( 'Update', ['class'=>'btn btn-success']) !!} <button class="btn btn-default pull-right"><a href="{{ url(config('laraadmin.adminRoute') . '/quote_my_apps') }}">Cancel</a></button>
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
	$("#quote_my_app-edit-form").validate({
		
	});
});
</script>
@endpush
