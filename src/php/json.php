<?php

if(isset($_POST['object'])) {
    $json = json_encode($_POST['object'],JSON_PRETTY_PRINT);
    $fp = fopen('redirects.json', 'w');
    fwrite($fp, $json);
    fclose($fp);
} else {
    echo "Object Not Received";
}
?>

