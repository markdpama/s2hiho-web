@extends('la.layouts.app')

@section('htmlheader_title')
	Quote My App View
@endsection


@section('main-content')
<div id="page-content" class="profile2">
	<div class="bg-primary clearfix">


		<div class="col-md-2 actions" style="display:none;">
			@la_access("Quote_My_Apps", "edit")
				<a href="{{ url(config('laraadmin.adminRoute') . '/quote_my_apps/'.$quote_my_app->id.'/edit') }}" class="btn btn-xs btn-edit btn-default"><i class="fa fa-pencil"></i></a><br>
			@endla_access
			
			@la_access("Quote_My_Apps", "delete")
				{{ Form::open(['route' => [config('laraadmin.adminRoute') . '.quote_my_apps.destroy', $quote_my_app->id], 'method' => 'delete', 'style'=>'display:inline']) }}
					<button class="btn btn-default btn-delete btn-xs" type="submit"><i class="fa fa-times"></i></button>
				{{ Form::close() }}
			@endla_access
		</div>
	</div>

	<ul data-toggle="ajax-tab" class="nav nav-tabs profile" role="tablist">
		<li class=""><a href="{{ url(config('laraadmin.adminRoute') . '/quote_my_apps') }}" data-toggle="tooltip" data-placement="right" title="Back to Quote My Apps"><i class="fa fa-chevron-left"></i></a></li>
		<li class="active"><a role="tab" data-toggle="tab" class="active" href="#tab-general-info" data-target="#tab-info"><i class="fa fa-bars"></i> General Info</a></li>
	</ul>

	<div class="tab-content">
		<div role="tabpanel" class="tab-pane active fade in" id="tab-info">
			<div class="tab-content">
				<div class="panel infolist">
					<div class="panel-default panel-heading">
						<h4>General Info</h4>
						<span class="pull-right"></span>
					</div>
					<div class="panel-body">
						@la_display($module, 'business_objectives')
						@la_display($module, 'app_type')
						@la_display($module, 'ecosystem')
						@la_display($module, 'ui_custom')
						@la_display($module, 'app_features')
						@la_display($module, 'platform')
					</div>
				</div>
			</div>
		</div>

		
	</div>
	</div>
	</div>
</div>
@endsection
