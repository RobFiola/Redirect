if(!empty($_POST['data'])){
$data = $_POST['data'];
$fname = "redirects.json";

$file = fopen("/Redirect/src/js/" .$fname, 'w');//creates new file
fwrite($file, $data);
fclose($file);
}