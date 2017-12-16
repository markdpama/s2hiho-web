<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends S2HIHO_Controller {

	function __construct()
	{
		parent::__construct();
		$this->_data->page_title          = 'Home';
		$this->_data->page                = 'home';

	}	

	public function index()
	{
		//$this->load->view('upload_form');

		$this->load->view($this->_data->tpl_view, $this->_data);
	}
}
