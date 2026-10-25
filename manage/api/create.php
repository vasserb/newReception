<?php
//Отображение всех ошибок
error_reporting(E_ALL);
ini_set('display_errors', 'On');
//конец

include ("functions.php");
function uuidv4()
{
  $data = random_bytes(16);

  $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
  $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10
    
  return vsprintf('%s%s%s%s%s%s%s%s', str_split(bin2hex($data), 4));
}



//Преобразовать все параметры из строки браузера в переменные
foreach ( $_GET as $key => $value ) 
{$$key = $value;}
//конец

//Подключение к БД
$db_host = "localhost"; 
$db_user = "user"; // Логин БД
$db_password = "password"; // Пароль БД
$db_base = 'reception'; // Имя БД
$mysqli = new mysqli($db_host,$db_user,$db_password,$db_base);

// Если есть ошибка соединения, выводим её и убиваем подключение
if ($mysqli->connect_error) {
    die('Ошибка : ('. $mysqli->connect_errno .') '. $mysqli->connect_error);
}
if (!$mysqli->set_charset("utf8")) {
    //printf("Ошибка при загрузке набора символов utf8: %s\n", $mysqli->error);
exit();
}

if ($_SERVER['REQUEST_METHOD'] == "POST"){
	$GUID = $_POST['GUID'];
	$post = $_POST['Post'];
	$place = $_POST['Place'];

	echo($GUID." | ".$post." | ".$place);
	
	$insert = $mysqli->query("UPDATE `users` SET Post = '$post', Place = '$place' where GUID = '$GUID'");
	if ($insert == true){
	    echo "Информация изменена";
	    http_response_code(200);
	}else{
	   echo "Информация не изменена";
	    echo $mysqli->error;
	    http_response_code(400);
	}
}
?>
