<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if ( ! function_exists('message_box'))
{
	function message_box()
	{
		// Set the config file options
		$CI =& get_instance();
		
		$success = $CI->session->flashdata('success');
		$error   = $CI->session->flashdata('error');
		$notice  = $CI->session->flashdata('notice');
		$info    = $CI->session->flashdata('info');
		$html = '';
		
		if($success){
			$html .= '<div class="alert alert-success fade in">
                      <button data-dismiss="alert" class="close close-sm" type="button">
                          <i class="icon-remove"></i>
                      </button>'.$success.'</div>';
	    }
	    
		if($error){
			$html .= '<div class="alert alert-danger fade in">
                      <button data-dismiss="alert" class="close close-sm" type="button">
                          <i class="icon-remove"></i>
                      </button>'.$error.'</div>';
	    }
	    
		if($notice){
			$html .= '<div class="alert alert-warning fade in">
                      <button data-dismiss="alert" class="close close-sm" type="button">
                          <i class="icon-remove"></i>
                      </button>'.$notice.'</div>';
	    }		

	    if($info){
			$html .= '<div class="alert alert-info fade in">
                      <button data-dismiss="alert" class="close close-sm" type="button">
                          <i class="icon-remove"></i>
                      </button>'.$info.'</div>';
	    }
	    
	    echo $html;    
	}
	
}

if ( ! function_exists('set_message'))
{
	function set_message($type='msgbox',$message)
	{
		// Set the config file options
		$CI =& get_instance();
		$CI->session->set_flashdata($type,$message);
   
	}
}

if ( ! function_exists('d'))
{
    //--debug array
	function d($array,$die=true)
	{
		echo '<pre>';
			print_r($array);
		echo '</pre>';
		
		if($die)
		   exit;

	}

}


