<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?>

<!DOCTYPE html>
<html lang="en">

  <head>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>S2-HiHo</title>

    <!-- Bootstrap core CSS -->
    <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">


    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

    <!-- Custom styles for this template -->
    <style>
      body {
        padding-top: 54px;
      }
      @media (min-width: 992px) {
        body {
          padding-top: 56px;
        }
      }

    </style>


  </head>

  <body>


    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">S2-HiHo</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a href="#">Home</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>

    <div class="container">

      <div class="starter-template">
        <h1>Upload Zip File</h1>
        <div class="row">
        	<div class="col-lg-12">

	    		<form method="post" action="<?php echo base_url('api/template/upload') ?>" enctype="multipart/form-data">
					<div class="file-loading">
					    <input name="userfile" type="file" >
					</div>
					<br />
					<input type="submit" class="btn btn-success" value="Upload" />
				</form>	

        	</div>
        </div>



      </div>

    </div><!-- /.container -->


    <!-- Bootstrap core JavaScript -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.min.js"></script>
<!--
	<script src="/js/plugins/piexif.js"></script>
	<script src="/js/fileinput.js"></script>

	 
	<script>
	$("#input-image-1").fileinput({
	    uploadUrl: "/site/image-upload",
	    allowedFileExtensions: ["jpg", "png", "gif"],
	    maxImageWidth: 200,
	    maxFileCount: 1,
	    resizeImage: true
	}).on('filepreupload', function() {
	    $('#kv-success-box').html('');
	}).on('fileuploaded', function(event, data) {
	    $('#kv-success-box').append(data.response.link);
	    $('#kv-success-modal').modal('show');
	});
	</script>
-->

  </body>

</html>
