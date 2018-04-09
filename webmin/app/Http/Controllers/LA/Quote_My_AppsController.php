<?php
/**
 * Controller genrated using LaraAdmin
 * Help: http://laraadmin.com
 */

namespace App\Http\Controllers\LA;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests;
use Auth;
use DB;
use Validator;
use Datatables;
use Collective\Html\FormFacade as Form;
use Dwij\Laraadmin\Models\Module;
use Dwij\Laraadmin\Models\ModuleFields;

use App\Models\Quote_My_App;

class Quote_My_AppsController extends Controller
{
	public $show_action = true;
	public $view_col = 'business_objectives';
	public $listing_cols = ['id', 'business_objectives', 'platform', 'app_type', 'ecosystem', 'ui_custom', 'app_features'];
	
	public function __construct() {
		// Field Access of Listing Columns
		if(\Dwij\Laraadmin\Helpers\LAHelper::laravel_ver() == 5.3) {
			$this->middleware(function ($request, $next) {
				$this->listing_cols = ModuleFields::listingColumnAccessScan('Quote_My_Apps', $this->listing_cols);
				return $next($request);
			});
		} else {
			$this->listing_cols = ModuleFields::listingColumnAccessScan('Quote_My_Apps', $this->listing_cols);
		}
	}
	
	/**
	 * Display a listing of the Quote_My_Apps.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		$module = Module::get('Quote_My_Apps');
		
		if(Module::hasAccess($module->id)) {
			return View('la.quote_my_apps.index', [
				'show_actions' => $this->show_action,
				'listing_cols' => $this->listing_cols,
				'module' => $module
			]);
		} else {
            return redirect(config('laraadmin.adminRoute')."/");
        }
	}

	/**
	 * Show the form for creating a new quote_my_app.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created quote_my_app in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{
		if(Module::hasAccess("Quote_My_Apps", "create")) {
		
			$rules = Module::validateRules("Quote_My_Apps", $request);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();
			}
			
			$insert_id = Module::insert("Quote_My_Apps", $request);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.quote_my_apps.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Display the specified quote_my_app.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		if(Module::hasAccess("Quote_My_Apps", "view")) {
			
			$quote_my_app = Quote_My_App::find($id);
			if(isset($quote_my_app->id)) {
				$module = Module::get('Quote_My_Apps');
				$module->row = $quote_my_app;
				
				return view('la.quote_my_apps.show', [
					'module' => $module,
					'view_col' => $this->view_col,
					'no_header' => true,
					'no_padding' => "no-padding"
				])->with('quote_my_app', $quote_my_app);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("quote_my_app"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Show the form for editing the specified quote_my_app.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id)
	{
		if(Module::hasAccess("Quote_My_Apps", "edit")) {			
			$quote_my_app = Quote_My_App::find($id);
			if(isset($quote_my_app->id)) {	
				$module = Module::get('Quote_My_Apps');
				
				$module->row = $quote_my_app;
				
				return view('la.quote_my_apps.edit', [
					'module' => $module,
					'view_col' => $this->view_col,
				])->with('quote_my_app', $quote_my_app);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("quote_my_app"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Update the specified quote_my_app in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, $id)
	{
		if(Module::hasAccess("Quote_My_Apps", "edit")) {
			
			$rules = Module::validateRules("Quote_My_Apps", $request, true);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();;
			}
			
			$insert_id = Module::updateRow("Quote_My_Apps", $request, $id);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.quote_my_apps.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Remove the specified quote_my_app from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		if(Module::hasAccess("Quote_My_Apps", "delete")) {
			Quote_My_App::find($id)->delete();
			
			// Redirecting to index() method
			return redirect()->route(config('laraadmin.adminRoute') . '.quote_my_apps.index');
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}
	
	/**
	 * Datatable Ajax fetch
	 *
	 * @return
	 */
	public function dtajax()
	{
		$values = DB::table('quote_my_apps')->select($this->listing_cols)->whereNull('deleted_at');
		$out = Datatables::of($values)->make();
		$data = $out->getData();

		$fields_popup = ModuleFields::getModuleFields('Quote_My_Apps');
		
		for($i=0; $i < count($data->data); $i++) {
			for ($j=0; $j < count($this->listing_cols); $j++) { 
				$col = $this->listing_cols[$j];
				if($fields_popup[$col] != null && starts_with($fields_popup[$col]->popup_vals, "@")) {
					$data->data[$i][$j] = ModuleFields::getFieldValue($fields_popup[$col], $data->data[$i][$j]);
				}
				if($col == $this->view_col) {
					$data->data[$i][$j] = '<a href="'.url(config('laraadmin.adminRoute') . '/quote_my_apps/'.$data->data[$i][0]).'">'.$data->data[$i][$j].'</a>';
				}
				// else if($col == "author") {
				//    $data->data[$i][$j];
				// }
			}
			
			if($this->show_action) {
				$output = '';
				if(Module::hasAccess("Quote_My_Apps", "edit")) {
					$output .= '<a href="'.url(config('laraadmin.adminRoute') . '/quote_my_apps/'.$data->data[$i][0].'/edit').'" class="btn btn-warning btn-xs" style="display:inline;padding:2px 5px 3px 5px;"><i class="fa fa-edit"></i></a>';
				}
				
				if(Module::hasAccess("Quote_My_Apps", "delete")) {
					$output .= Form::open(['route' => [config('laraadmin.adminRoute') . '.quote_my_apps.destroy', $data->data[$i][0]], 'method' => 'delete', 'style'=>'display:inline']);
					$output .= ' <button class="btn btn-danger btn-xs" type="submit"><i class="fa fa-times"></i></button>';
					$output .= Form::close();
				}
				$data->data[$i][] = (string)$output;
			}
		}
		$out->setData($data);
		return $out;
	}
}
