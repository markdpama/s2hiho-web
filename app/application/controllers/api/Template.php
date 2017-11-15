<?php

defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
require APPPATH . '/libraries/REST_Controller.php';

/**
 * This is an example of a few basic user interaction methods you could use
 * all done with a hardcoded array
 *
 * @package         CodeIgniter
 * @subpackage      Rest Server
 * @category        Controller
 * @author          Phil Sturgeon, Chris Kacerguis
 * @license         MIT
 * @link            https://github.com/chriskacerguis/codeigniter-restserver
 */
class Template extends \Restserver\Libraries\REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();

    }

    public function getList_get()
    {
    	$this->load->helper('directory');
    	$map = directory_map('./uploads/');

    	$files = [];

    	foreach ($map as $file) {
    		$ext = explode(".", $file)[1];
    		if($ext !== "html"){
    			$files[] = base_url('uploads/'.$file);
    		}

    	}

        $this->set_response([
            'status' => "success",
            'files' =>  $files
        ], 200); 

    }

    public function upload_post()
    {
    		
        $config['upload_path']          = './uploads/';
        $config['allowed_types']        = 'zip|tar|gz';
        $config['max_size']             = 5000;


 		$ext = end(explode(".", $_FILES["userfile"]['name']));

		$new_name = $_FILES["userfile"]['name']."_".date("Ymd_H-i-s").".".$ext;
	    $config['file_name'] = $new_name;

	    

        $this->load->library('upload', $config);

        if ( ! $this->upload->do_upload('userfile'))
        {
            $error = array('error' => strip_tags($this->upload->display_errors()) );

            $this->set_response([
                'status' => "error",
                'message' => $error
            ], 500); // NOT_FOUND (404) being the HTTP response code

        }
        else
        {
            //$data = array('upload_data' => $this->upload->data());
            $updata = $this->upload->data();

            $file_url = base_url('uploads/'.$updata["file_name"]);

            $data = array("file_name" =>  $updata["file_name"], "file_url" => $file_url );
            
            $this->set_response([
                'status' => "success",
                'data' =>  $data
            ], 200); 
        }
		
    }

}

