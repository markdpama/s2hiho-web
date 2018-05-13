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


function calculate_quote_app($request){

        $feature_price = array(
             //--Percentile
            'platform' => array(
                'iOS' => 50,
                'Web' => 40,
                'Android' => 50,
                
                //'All' => 120,
            ),
            //TO simplify. All value is in thousand(*1000)
            'app_type' => array(
                'Offline and Static' => 60,
                'Online and Dynamic' => 100,
            ),

            'ecosystem' => array(
                'Single Application' => 80,
                'Console App and Field App' => 150,
            ),

            'ui_custom' => array(
                'Standard Look and Feel' => 60,
                'Custom User Interface' => 120,
            ),

            'app_features' => array(
                'Account Creation and Sign-Up' => 60, 
                'Analytics and Aggregation' => 160, 
                'Notifications' => 80, 
                'Social Media Integration' => 100, 
                'Calendar and Scheduler' => 140, 
                'Payment and Promotions' => 80, 
            ),

        );


        $quote_total = 0;
        $platform_multiplier = 0;
        $options_total = 0;

        if(isset($request['app_type'])){
            $options_total += $feature_price['app_type'][$request['app_type']];
        }

        if(isset($request['ecosystem'])){
            $options_total += $feature_price['ecosystem'][$request['ecosystem']];
        }

        if(isset($request['ui_custom'])){
            $options_total += $feature_price['ui_custom'][$request['ui_custom']];
        }

        if(isset($request['app_features'])){

            foreach ($request['app_features'] as $app_feature) {
                $options_total += $feature_price['app_features'][$app_feature]; 
            }
            
        }

        if(isset($request['platform'])){
            //--selected all?

            foreach ($request['platform'] as $platform) {
                $platform_multiplier += $feature_price['platform'][$platform];  
            }
            
        }

        //echo "options_total=".$options_total."<br />";
        //echo "platform_multiplier=".$platform_multiplier."<br />";

        $quote_total = ($options_total*1000)*$platform_multiplier/100;

        return number_format($quote_total);

}