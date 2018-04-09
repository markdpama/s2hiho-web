<?php
/**
HELPERS
 */

function validate_captcha($request){
    $post_data = http_build_query(
        array(
            'secret' => "6LdnLjcUAAAAAOu7AZ1UuvbD16nUCw6GmLn-jXZd",
            'response' => $request['g-recaptcha-response'],
            'remoteip' => $_SERVER['REMOTE_ADDR']
        )
    );
    $opts = array('http' =>
        array(
            'method'  => 'POST',
            'header'  => 'Content-type: application/x-www-form-urlencoded',
            'content' => $post_data
        )
    );
    $context  = stream_context_create($opts);
    $response = file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $context);
    $result = json_decode($response);
    if (!$result->success) {
        return "reCAPTCHA verification failed.";
    }
    return null;
}