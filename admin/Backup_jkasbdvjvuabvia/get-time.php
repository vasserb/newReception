<?php

error_reporting(E_ALL);
ini_set('display_errors', 'On');

foreach ( $_GET as $key => $value ) 
{$$key = $value;}

$db_host = "localhost"; 
$db_user = "user"; // Логин БД
$db_password = "password"; // Пароль БД
$db_base = 'reception'; // Имя БД
    
// Подключение к базе данных
$mysqli = new mysqli($db_host,$db_user,$db_password,$db_base);

// Если есть ошибка соединения, выводим её и убиваем подключение
if ($mysqli->connect_error) {
    die('Ошибка : ('. $mysqli->connect_errno .') '. $mysqli->connect_error);
}
if (!$mysqli->set_charset("utf8")) {
    //printf("Ошибка при загрузке набора символов utf8: %s\n", $mysqli->error);
exit();
}
$result_time=[];
$result = $mysqli->query("SELECT * FROM `time` where Id='".$IdDate."'");
	if (mysqli_num_rows($result)!=0){
        if ($result == true){
        	while($myrow = mysqli_fetch_array($result)){
				$time = explode(";", $myrow['Time']);
        		for($x=0; $x<sizeof($time); $x++){
					$check = $mysqli->query("SELECT * FROM `event` where IdDate='".$IdDate."' AND Time='".$time[$x]."' AND Archive=0");
        			if(mysqli_num_rows($check)==0){
        				array_push($result_time, $time[$x]);
        			}
				}
        	}
        }
	}
echo json_encode($result_time);


?>