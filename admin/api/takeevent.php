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

$vowels = array("\"", "'", "(", ")", "<", ">", "{", "}", ":", "-", "[", "]", ";", "\n");

//Запрос к БД с параметром GUID
$result = $mysqli->query("SELECT * FROM `event` where IdDate='".$IdDate."' AND Archive='0' ORDER BY Time");
    if (mysqli_num_rows($result)!=0){
        if ($result == true){
            $users_result=('[');
            $zap="";//Служит для отсутствия первой запятой
            while($myrow = mysqli_fetch_array($result)){
                $users_result=$users_result.$zap.'{';
				$users_result=$users_result.'"Id": "'.$myrow['Id'].'",';
                $users_result=$users_result.'"FIO": "'.replaceJson($myrow['FIO']).'",';
                $users_result=$users_result.'"FIOChild": "'.replaceJson($myrow['FIOChild']).'",';
                $users_result=$users_result.'"Tel": "'.$myrow['Tel'].'",';
                $users_result=$users_result.'"Time": "'.$myrow['Time'].'",';
                $users_result=$users_result.'"DopInfo": "'.replaceJson($myrow['DopInfo']).'",';
				$users_result=$users_result.'"IdDate": "'.$myrow['IdDate'].'"';
                $users_result=$users_result.'}';
                $zap=', ';
            }
            $users_result=$users_result.(']');
            http_response_code(200);
            echo($users_result);

        }else{
			http_response_code(400);
            echo '{"status": "Информация не прочитана"}';
            $users_result="none";
            echo $mysqli->error;
        }
    }else{
        $users_result="none";
		http_response_code(200);
        echo('{"status": "Ничего не найдено"}');
    }
?>