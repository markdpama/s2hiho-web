<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class S2HIHO_Controller extends CI_Controller {

	function __construct()
	{
		parent::__construct();
        
        //global data
        $this->_data  = new stdClass;
		$this->_data->tpl_view            = $this->config->item('template_path');
		$this->_data->assets_url          = base_url('assets');
		$this->_data->current_method      = $current_method = $this->router->method;
		$this->_data->current_controller  = $current_controller = strtolower( $this->router->class );
		
		//$current_user = $this->current_user();
		//$this->_data->current_user->role = 'ADMIN';
		//d($current_user);
		
		$_user_method = array('login','doGplusLogin','error','forceLogin','bakLogin');
		if( !in_array($current_method, $_user_method) ){
			if(!isset($current_user->id)){
				//redirect( base_url('user/login?ctr=1') );
			}
		}


		//$this->_data->current_user = $current_user;
		
	}


	function current_user()
	{
		return (object) $this->ci()->session->userdata('current_user');
	}	

	function is_loggedin()
	{
		return isset( $this->current_user()->id) ? TRUE : FALSE;
	}	

	function ci()
	{
		return get_instance();
	}


}

?>
