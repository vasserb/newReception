<?php
//Отображение всех ошибок
error_reporting(E_ALL);
ini_set('display_errors', 'On');
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


//Запрос к БД с параметром GUID
$result = $mysqli->query("SELECT time.Id as Id, time.Date as Date, time.GUID as GUID, users.FIO as FIO, users.url as url, users.Place as Place FROM `time` LEFT JOIN users USING(GUID) where Date='".$Date."' AND url LIKE '%_admin' ORDER BY FIO");
    if (mysqli_num_rows($result)!=0){
        if ($result == true){
            $users_result=('[');
            $zap="";//Служит для отсутствия первой запятой
            while($myrow = mysqli_fetch_array($result)){
                $users_result=$users_result.$zap.('{');
                $users_result=$users_result.'"FIO": "'.$myrow['FIO'].'",';
                $users_result=$users_result.'"Place": "'.$myrow['Place'].'",';
                $users_result=$users_result.'"Date": "'.russData($myrow['Date']).'",';
                $users_result=$users_result.'"Id": "'.$myrow['Id'].'"';
                $users_result=$users_result.'}';
                $zap=', ';
            }
            $users_result=$users_result.(']');
            http_response_code(200);
            echo($users_result);
        }else{
			http_response_code(400);
            echo "Информация не прочитана";
            $users_result="none";
            echo $mysqli->error;
        }
    }else{
        $users_result="none";
		http_response_code(400);
        echo('Ничего не найдено');
    }
?>