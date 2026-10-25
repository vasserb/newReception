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
$result = $mysqli->query("SELECT * FROM `users` where GUID='".$GUID."'");
    if (mysqli_num_rows($result)!=0){
        if ($result == true){
            while($myrow = mysqli_fetch_array($result)){
                $users_result=('{');
                $users_result=$users_result.'"FIO": "'.$myrow['FIO'].'",';
                $users_result=$users_result.'"Place": "'.$myrow['Place'].'",';
                //$users_result=$users_result.'"GUID": "'.$myrow['GUID'].'",';
                $users_result=$users_result.'"Id": "'.$myrow['Id'].'",';
                $GUID=$myrow['GUID'];
            }
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

if($users_result!="none"){//Если инфа прочитана, все найдено итд
    //Запрос к БД на предмет доступных дат больше текущей и меньше чем за 1 месяц
    $dates = $mysqli->query("SELECT * FROM `time` where GUID='".$GUID."' AND Date>=ADDDATE(CURDATE(), -31) AND Date<=ADDDATE(CURDATE(), 31) AND Archive=0 ORDER BY Date");
    if (mysqli_num_rows($dates)!=0){
        if ($dates == true){
            $dates_result=' "dates": [';//Формируем json массив с датами
            $zap="";//Служит для отсутствия первой запятой
            while($myrow = mysqli_fetch_array($dates)){
                $time = explode(";", $myrow['Time']);//Делаем массив из времени
                $time_json=json_encode($time);
                $dates_result=$dates_result.$zap.'{"IdDate": "'.$myrow['Id'].'", "Date": "'.russData($myrow['Date']).'", "Time": '.$time_json.'}';
                $zap=', ';//Служит для отсутствия первой запятой
            }
        }
        $dates_result=$dates_result."]";
        $users_result=$users_result.$dates_result."}";
		http_response_code(200);
        echo($users_result);
    }else{
        $users_result=$users_result.'"dates": ""}';
		http_response_code(200);
        echo($users_result);
    }
}

?>