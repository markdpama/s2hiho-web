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

use App\Models\Contact_Data;

class Contact_DatasController extends Controller
{
	public $show_action = true;
	public $view_col = 'first_name';
	public $listing_cols = ['id', 'first_name', 'last_name', 'email', 'country', 'message','form'];
    
    public $json_response = array(
            'success' => false,
            'message' => 'Some error occured while submitting your inquiries. Please try again...'
    );

    public $rules = [
			'first_name' => 'required',
			'last_name'  => 'required',
			'email'      => 'required|email',
			'message'    => 'required',
			'form'       => 'required',
	];
	
	public function __construct() {
		// Field Access of Listing Columns
		if(\Dwij\Laraadmin\Helpers\LAHelper::laravel_ver() == 5.3) {
			$this->middleware(function ($request, $next) {
				$this->listing_cols = ModuleFields::listingColumnAccessScan('Contact_Datas', $this->listing_cols);
				return $next($request);
			});
		} else {
			$this->listing_cols = ModuleFields::listingColumnAccessScan('Contact_Datas', $this->listing_cols);
		}
	}
	
	/**
	 * Display a listing of the Contact_Datas.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function index()
	{
		$module = Module::get('Contact_Datas');
		
		if(Module::hasAccess($module->id)) {
			return View('la.contact_datas.index', [
				'show_actions' => $this->show_action,
				'listing_cols' => $this->listing_cols,
				'module' => $module
			]);
		} else {
            return redirect(config('laraadmin.adminRoute')."/");
        }
	}

	/**
	 * Show the form for creating a new contact_data.
	 *
	 * @return \Illuminate\Http\Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created contact_data in database.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return \Illuminate\Http\Response
	 */
	public function store(Request $request)
	{
		if(Module::hasAccess("Contact_Datas", "create")) {
		
			$rules = Module::validateRules("Contact_Datas", $request);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();
			}
			
			$insert_id = Module::insert("Contact_Datas", $request);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.contact_datas.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}


	/**
	 * Display the specified contact_data.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function show($id)
	{
		if(Module::hasAccess("Contact_Datas", "view")) {
			
			$contact_data = Contact_Data::find($id);
			if(isset($contact_data->id)) {
				$module = Module::get('Contact_Datas');
				$module->row = $contact_data;
				
				return view('la.contact_datas.show', [
					'module' => $module,
					'view_col' => $this->view_col,
					'no_header' => true,
					'no_padding' => "no-padding"
				])->with('contact_data', $contact_data);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("contact_data"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Show the form for editing the specified contact_data.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function edit($id)
	{
		if(Module::hasAccess("Contact_Datas", "edit")) {			
			$contact_data = Contact_Data::find($id);
			if(isset($contact_data->id)) {	
				$module = Module::get('Contact_Datas');
				
				$module->row = $contact_data;
				
				return view('la.contact_datas.edit', [
					'module' => $module,
					'view_col' => $this->view_col,
				])->with('contact_data', $contact_data);
			} else {
				return view('errors.404', [
					'record_id' => $id,
					'record_name' => ucfirst("contact_data"),
				]);
			}
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Update the specified contact_data in storage.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function update(Request $request, $id)
	{
		if(Module::hasAccess("Contact_Datas", "edit")) {
			
			$rules = Module::validateRules("Contact_Datas", $request, true);
			
			$validator = Validator::make($request->all(), $rules);
			
			if ($validator->fails()) {
				return redirect()->back()->withErrors($validator)->withInput();;
			}
			
			$insert_id = Module::updateRow("Contact_Datas", $request, $id);
			
			return redirect()->route(config('laraadmin.adminRoute') . '.contact_datas.index');
			
		} else {
			return redirect(config('laraadmin.adminRoute')."/");
		}
	}

	/**
	 * Remove the specified contact_data from storage.
	 *
	 * @param  int  $id
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($id)
	{
		if(Module::hasAccess("Contact_Datas", "delete")) {
			Contact_Data::find($id)->delete();
			
			// Redirecting to index() method
			return redirect()->route(config('laraadmin.adminRoute') . '.contact_datas.index');
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
		$values = DB::table('contact_datas')->select($this->listing_cols)->whereNull('deleted_at');
		$out = Datatables::of($values)->make();
		$data = $out->getData();

		$fields_popup = ModuleFields::getModuleFields('Contact_Datas');
		
		for($i=0; $i < count($data->data); $i++) {
			for ($j=0; $j < count($this->listing_cols); $j++) { 
				$col = $this->listing_cols[$j];
				if($fields_popup[$col] != null && starts_with($fields_popup[$col]->popup_vals, "@")) {
					$data->data[$i][$j] = ModuleFields::getFieldValue($fields_popup[$col], $data->data[$i][$j]);
				}
				if($col == $this->view_col) {
					$data->data[$i][$j] = '<a href="'.url(config('laraadmin.adminRoute') . '/contact_datas/'.$data->data[$i][0]).'">'.$data->data[$i][$j].'</a>';
				}
				// else if($col == "author") {
				//    $data->data[$i][$j];
				// }
			}
			
			if($this->show_action) {
				$output = '';
				if(Module::hasAccess("Contact_Datas", "edit")) {
					$output .= '<a href="'.url(config('laraadmin.adminRoute') . '/contact_datas/'.$data->data[$i][0].'/edit').'" class="btn btn-warning btn-xs" style="display:inline;padding:2px 5px 3px 5px;"><i class="fa fa-edit"></i></a>';
				}
				
				if(Module::hasAccess("Contact_Datas", "delete")) {
					$output .= Form::open(['route' => [config('laraadmin.adminRoute') . '.contact_datas.destroy', $data->data[$i][0]], 'method' => 'delete', 'style'=>'display:inline']);
					$output .= ' <button class="btn btn-danger btn-xs" type="submit"><i class="fa fa-times"></i></button>';
					$output .= Form::close();
				}
				$data->data[$i][] = (string)$output;
			}
		}
		$out->setData($data);
		return $out;
	}


	/* CREATE DATA FROM API END POINT - 04-09-18 */
	public function save(Request $request)
	{

		//$rules = Module::validateRules("Contact_Datas", $request);
		$isValid = true;
		
		$validator = Validator::make($request->all(), $this->rules);

		$this->json_response['message'] = array();

		if( $captch_resp = validate_captcha($request) ){
			$this->json_response['success'] = $isValid = false;
			array_push($this->json_response['message'], $captch_resp);
		}

		if ($validator->fails()) {
			//$this->json_response['message'][] = $validator->errors()->all();
			$this->json_response['success'] = $isValid = false;
			array_push($this->json_response['message'], $validator->errors()->all());

		}
		
		if($isValid){
			$insert_id = Module::insert("Contact_Datas", $request);
			$this->json_response['message'] = "Ok";
			$this->json_response['success'] = true;	
		}

		return response()->json($this->json_response);

	}



}
