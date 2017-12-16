<?php 
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
?>
 
<?php include('main_meta.php'); ?>
 

<body class="login-body">
	<div class="login-corner-flux-topright"></div>
	<div class="login-corner-flux-botleft"></div>
	
    <div class="container">
      <br />
      <br />
      <br />
      <form id="frmLogin" class="form-signin" action="<?php echo base_url('user/login') ?>" onsubmit="return false">
        <h2 class="form-signin-heading">
        	<div class="loginlogo"></div>
        	Internal Customer Satisfaction (iCSAT) <br /><?php echo date('Y') ?> End of Year Survey
        </h2>


        <div class="login-wrap">
        	<br />
	         <?php if($hasError){ ?>
			<div class="alert alert-block alert-danger fade in text-center">
					<strong>Oops! Something wasn't right!</strong><br />
					<?php echo $errorMessage ?>
			</div>
			<p style="color:#777">
				Please contact icsatteam@globe.com.ph
			</p>
			<br />
			<?php } ?>

            <p class="text-center">
           		 <a href="<?php echo $authUrl ?>" onclick="$('#loginPreloader').show()"><img src="<?php echo base_url('assets/img/btn_gplus_login.png') ?>"></a>
            </p>
            <br />
			 <div style="display:none" class="progress progress-striped active progress-sm" id="loginPreloader">
	           <div style="width: 100%" aria-valuemax="100" aria-valuemin="0" aria-valuenow="45" role="progressbar" class="progress-bar progress-bar-info"></div>
	         </div>

	         <div id="msgbox"></div>

        </div>


      </form>

</div>


  <script src="<?php echo $assets_url ?>/js/jquery.js"></script>
  <script src="<?php echo $assets_url ?>/js/bootstrap.min.js"></script>

  <script>
  <?php /*
	function signinCallback(authResult) {
		
	  if (authResult['status']['signed_in']) {
	  	console.log( authResult );
	  	console.log('CODE:'+ authResult['code'] );
	    // Update the app to reflect a signed in user
	    // Hide the sign-in button now that the user is authorized, for example:
	    document.getElementById('signinButton').setAttribute('style', 'display: none');

				gapi.client.load('plus','v1', function(){
				 var request = gapi.client.plus.people.get({
				   'userId': 'me',
				   'scope': 'profile email',
				 });
				 request.execute(function(resp) {
				   console.log(resp);
				   //console.log('Retrieved profile for:' + resp.displayName);
				 });
				})

	  } else {
	    // Update the app to reflect a signed out user
	    // Possible error values:
	    //   "user_signed_out" - User is signed-out
	    //   "access_denied" - User denied access to your app
	    //   "immediate_failed" - Could not automatically log in the user
	    console.log('Sign-in state: ' + authResult['error']);
	  }
	}
*/ ?>

      $(document).ready(function() {
                var preloader = $('#loginPreloader');
          		var uname = $('#uname');
          		var pwd = $('#pwd');

	          $('#btnDoLogin').click( function(e){
	            //e.preventDefault();
	            if( uname.val() == '' || pwd.val() == ''){
	              displayMessage('error','Please fill up your Username and Password',true); 
	              return false;
	            }

	                preloader.show();
	                  $.ajax({
	                      url: base_url+'user/login',
	                      data: $('#frmLogin').serialize(),
	                      type: 'post',
	                      success: function(response){
	                          var resp = jQuery.parseJSON( response );
	                          if( typeof(resp) == 'object'){
	                            
	                            displayMessage(resp.status,resp.msg,true); 
	                              
	                              if(resp.status == 'success'){
	                                   window.location = resp.redirect_to;
	                              }
	                              preloader.hide();
	                          } 
	                      }, 
	                      error: function(){
	                          alert('Some error occured or the system is busy. Please try again later');  
	                          preloader.hide();
	                      }
	                  });

	          });

			displayMessage = function(type, message, removePrevious) {
			        var msgtype = 'info';

			        switch(type) 
			        {
			            case "success":
			                msgtype = 'success';
			            break;
			            case "error":
			                msgtype = 'danger';
			            break;      
			            case "notice":
			                msgtype = 'warning';
			            break;
			        }

			        var msg = '<div style="display:none" class="alert alert-'+msgtype+' fade in"><button data-dismiss="alert" class="close close-sm" type="button"><i class="icon-remove"></i></button>'+ message + '</div>';

			        if(removePrevious==true){
			            $('#msgbox').html('');
			        }

			        $('#msgbox').append(msg); 

			        $('#msgbox .alert:last').fadeIn();
			};
      
      });



  </script>
</body>
</html>

