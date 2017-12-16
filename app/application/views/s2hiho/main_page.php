
<div id="preLoader" class="opacity"><div id="status"><div class="text">We are processing your selection, Please wait...</div></div></div>
<?php 
				
if(file_exists( dirname(__FILE__) . '/pages/page_'.$page.'.html')){

	include('pages/page_'.$page.'.html'); 
}else{
	echo 'Template file not exist: <strong>'.$page.'</strong>';
}
					
?>
