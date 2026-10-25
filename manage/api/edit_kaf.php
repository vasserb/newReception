<?php
//Отображение всех ошибок
//error_reporting(E_ALL);
//ini_set('display_errors', 'On');
//конец
include ("functions.php");

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
	$post = $_POST['kaf'];

	echo($GUID." | ".$post." | ".$place);
	
	$insert = $mysqli->query("UPDATE `users` SET kaf = '$kaf' where GUID = '$GUID'");
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